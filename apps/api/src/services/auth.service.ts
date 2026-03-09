import type { PrismaClient } from '@prisma/client';

/** Hash a plaintext password using bcrypt */
export async function hashPassword(password: string): Promise<string> {
  // TODO: implement with bcryptjs — hash(password, 12)
  return `hashed_${password}`;
}

/** Compare a plaintext password against a bcrypt hash */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // TODO: implement with bcryptjs — compare(password, hash)
  return false;
}

/** Create a new user with email/password */
export async function createUser(prisma: PrismaClient, email: string, passwordHash: string) {
  // TODO: insert user into database, handle duplicate email errors
  return { id: '', email, createdAt: new Date().toISOString() };
}

/** Find a user by email for login */
export async function findUserByEmail(prisma: PrismaClient, email: string) {
  // TODO: query users table by email
  return null;
}

/** Generate JWT access and refresh tokens for a user */
export function generateTokens(userId: string, jwtSign: (payload: object) => string) {
  // TODO: generate access token (short-lived) and refresh token (long-lived)
  return { accessToken: '', refreshToken: '' };
}

/** Verify and rotate a refresh token */
export async function refreshTokens(prisma: PrismaClient, refreshToken: string) {
  // TODO: verify refresh token, issue new pair, revoke old
  return null;
}
