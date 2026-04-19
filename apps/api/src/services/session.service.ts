import type { PrismaClient } from '@prisma/client';
import type { SessionMode } from '@speakcoach/shared';
import type { Env } from '../config';
import { analyzeSession } from './analysis.service';
import { generatePresignedUploadUrl } from '../utils/presign';

/** Create a new session for the user */
export async function createSession(
  prisma: PrismaClient,
  userId: string,
  mode: SessionMode,
  planDayId?: string,
) {
  const session = await prisma.session.create({
    data: {
      userId,
      mode,
      planDayId: planDayId || null,
      status: 'queued',
    },
  });

  return session;
}

/** Get session by ID, verifying ownership */
export async function getSession(prisma: PrismaClient, sessionId: string, userId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session || session.userId !== userId) return null;

  return session;
}

/** Generate a presigned S3 upload URL for a session's audio */
export async function getUploadUrl(prisma: PrismaClient, sessionId: string, userId: string, config: Env) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session || session.userId !== userId) {
    return null;
  }

  const audioKey = `${userId}/${sessionId}/audio.m4a`;

  if (config.AWS_ACCESS_KEY_ID) {
    const uploadUrl = await generatePresignedUploadUrl(
      config.BUCKET_NAME,
      audioKey,
      config,
    );
    return { uploadUrl, audioKey };
  }

  // Fallback for local dev without S3
  return { uploadUrl: `https://placeholder.storage/${audioKey}`, audioKey };
}

/** Submit session for analysis after audio upload */
export async function submitSession(
  prisma: PrismaClient,
  sessionId: string,
  userId: string,
  config: { deepgramApiKey: string; anthropicApiKey: string; redisUrl: string },
) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session || session.userId !== userId) return null;
  if (session.status !== 'queued') return null;

  await analyzeSession(prisma, sessionId, config);

  const updatedSession = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  return updatedSession;
}
