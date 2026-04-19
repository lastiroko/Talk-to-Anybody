import type { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const BCRYPT_ROUNDS = 12;

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

/** Generate a JWT access token for a user */
export function generateTokens(userId: string, jwtSign: (payload: { sub: string }) => string) {
  const accessToken = jwtSign({ sub: userId });
  // Refresh tokens require a separate signing config / storage — stub for now
  const refreshToken = '';
  return { accessToken, refreshToken };
}

/** Verify and rotate a refresh token */
export async function refreshTokens(_prisma: PrismaClient, _refreshToken: string) {
  // TODO: verify refresh token, issue new pair, revoke old
  return null;
}
