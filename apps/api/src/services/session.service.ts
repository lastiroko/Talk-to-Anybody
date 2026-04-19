import type { PrismaClient } from '@prisma/client';
import type { SessionMode } from '@speakcoach/shared';
import { analyzeSession } from './analysis.service';

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
export async function getUploadUrl(prisma: PrismaClient, sessionId: string, userId: string) {
  // Verify session ownership
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session || session.userId !== userId) {
    return null;
  }

  // Generate S3 key for the audio file
  const audioKey = `${userId}/${sessionId}/audio.m4a`;

  // TODO: Generate actual presigned S3 upload URL using AWS SDK
  // For now, return the key structure that will be used
  const uploadUrl = `https://s3.amazonaws.com/speakcoach-recordings/${audioKey}?presigned=placeholder`;

  return { uploadUrl, audioKey };
}

/** Submit session for analysis after audio upload */
export async function submitSession(
  prisma: PrismaClient,
  sessionId: string,
  userId: string,
  config: { deepgramApiKey: string; anthropicApiKey: string; redisUrl: string },
) {
  // Verify session ownership and status
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session || session.userId !== userId) return null;
  if (session.status !== 'queued') return null;

  // Trigger analysis pipeline (runs inline or enqueues depending on config)
  await analyzeSession(prisma, sessionId, config);

  // Fetch updated session
  const updatedSession = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  return updatedSession;
}
