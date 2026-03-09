import type { PrismaClient } from '@prisma/client';
import type { SessionMode } from '@speakcoach/shared';

/** Create a new session for the user */
export async function createSession(prisma: PrismaClient, userId: string, mode: SessionMode, planDayId?: string) {
  // TODO: insert session with status 'queued', return session record
  return null;
}

/** Get session by ID, verifying ownership */
export async function getSession(prisma: PrismaClient, sessionId: string, userId: string) {
  // TODO: query session by id, verify userId matches, return session or null
  return null;
}

/** Generate a presigned S3 upload URL for a session's audio */
export async function getUploadUrl(prisma: PrismaClient, sessionId: string, userId: string) {
  // TODO: verify session ownership, generate S3 key (userId/sessionId/audio.m4a),
  // call generatePresignedUploadUrl, return { uploadUrl, audioKey }
  return { uploadUrl: '', audioKey: '' };
}

/** Submit session for analysis after audio upload */
export async function submitSession(prisma: PrismaClient, sessionId: string, userId: string) {
  // TODO: verify session ownership and status, update status to 'processing',
  // enqueue analysis job (STT + scoring), return updated session
  return null;
}
