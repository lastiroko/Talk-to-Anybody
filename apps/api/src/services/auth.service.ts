import type { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';

const BCRYPT_ROUNDS = 12;

function hashRefreshToken(rawToken: string): string {
  return createHash('sha256').update(rawToken).digest('hex');
}

function generateRefreshTokenRaw(): string {
  return randomBytes(48).toString('base64url');
}

/** Hash a plaintext password using bcrypt */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/** Compare a plaintext password against a bcrypt hash */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Create a new user with email/password. Throws 409 if email already exists. */
export async function createUser(prisma: PrismaClient, email: string, passwordHash: string) {
  try {
    const user = await prisma.user.create({
      data: { email, passwordHash },
      select: {
        id: true,
        email: true,
        createdAt: true,
        goal: true,
        dailyMinutesTarget: true,
        timezone: true,
      },
    });
    return user;
  } catch (err: any) {
    // Prisma unique constraint violation
    if (err.code === 'P2002') {
      const error = new Error('A user with this email already exists');
      (error as any).statusCode = 409;
      throw error;
    }
    throw err;
  }
}

/** Find a user by email for login */
export async function findUserByEmail(prisma: PrismaClient, email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      createdAt: true,
      goal: true,
      dailyMinutesTarget: true,
      timezone: true,
    },
  });
}

/**
 * Issue a new access token + a fresh persistent refresh token for the user.
 * The raw refresh token is returned to the client; only its SHA-256 hash is stored.
 */
export async function generateTokens(
  prisma: PrismaClient,
  userId: string,
  jwtSign: (payload: { sub: string }) => string,
  refreshTtlDays: number,
) {
  const accessToken = jwtSign({ sub: userId });
  const refreshToken = generateRefreshTokenRaw();
  const expiresAt = new Date(Date.now() + refreshTtlDays * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt,
    },
  });

  return { accessToken, refreshToken };
}

/**
 * Verify a refresh token, revoke it (single-use rotation), and issue a fresh pair.
 * Returns null if the token is invalid, expired, or already revoked.
 */
export async function rotateRefreshToken(
  prisma: PrismaClient,
  rawToken: string,
  jwtSign: (payload: { sub: string }) => string,
  refreshTtlDays: number,
) {
  const tokenHash = hashRefreshToken(rawToken);
  const existing = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!existing || existing.revokedAt || existing.expiresAt < new Date()) {
    return null;
  }

  const accessToken = jwtSign({ sub: existing.userId });
  const newRaw = generateRefreshTokenRaw();
  const newExpiresAt = new Date(Date.now() + refreshTtlDays * 24 * 60 * 60 * 1000);

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: existing.id },
      data: { revokedAt: new Date() },
    }),
    prisma.refreshToken.create({
      data: {
        userId: existing.userId,
        tokenHash: hashRefreshToken(newRaw),
        expiresAt: newExpiresAt,
      },
    }),
  ]);

  return { accessToken, refreshToken: newRaw };
}

/** Revoke a single refresh token (logout from current device). Silent no-op if not found. */
export async function revokeRefreshToken(prisma: PrismaClient, rawToken: string) {
  const tokenHash = hashRefreshToken(rawToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
