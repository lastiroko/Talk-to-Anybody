import type { PrismaClient } from '@prisma/client';
import { ANXIETY_SPIKE_DELTA } from '@speakcoach/shared';

/** Store an anxiety rating and compute response metrics */
export async function recordAnxietyRating(
  prisma: PrismaClient,
  userId: string,
  sessionId: string,
  timing: 'pre' | 'post',
  rating: number,
) {
  // Upsert the anxiety rating record — one record per session with pre/post fields
  const updateData = timing === 'pre' ? { preRating: rating } : { postRating: rating };

  // Check if a record already exists for this session
  const existing = await prisma.anxietyRating.findFirst({
    where: { userId, sessionId },
  });

  if (existing) {
    await prisma.anxietyRating.update({
      where: { id: existing.id },
      data: updateData,
    });
  } else {
    await prisma.anxietyRating.create({
      data: {
        userId,
        sessionId,
        ...updateData,
      },
    });
  }

  // Calculate 7-day rolling average for pre-session ratings
  const rollingAvgPre = await getRollingAvgPre(prisma, userId);

  // Detect spike: pre-session rating >= rolling average + ANXIETY_SPIKE_DELTA
  const spikeDetected = timing === 'pre' && rating >= rollingAvgPre + ANXIETY_SPIKE_DELTA;
  const showCalmingExercise = spikeDetected;

  return {
    sessionId,
    timing,
    rating,
    rollingAvgPre,
    spikeDetected,
    showCalmingExercise,
  };
}

/** Get 7-day rolling average for pre-session anxiety ratings */
export async function getRollingAvgPre(prisma: PrismaClient, userId: string): Promise<number> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentRatings = await prisma.anxietyRating.findMany({
    where: {
      userId,
      preRating: { not: null },
      createdAt: { gte: sevenDaysAgo },
    },
    select: { preRating: true },
    orderBy: { createdAt: 'desc' },
  });

  if (recentRatings.length === 0) {
    return 5.0;
  }

  const sum = recentRatings.reduce((s, r) => s + (r.preRating ?? 0), 0);
  return Math.round((sum / recentRatings.length) * 10) / 10;
}
