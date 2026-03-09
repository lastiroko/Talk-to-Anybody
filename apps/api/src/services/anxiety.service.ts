import type { PrismaClient } from '@prisma/client';
import { ANXIETY_SPIKE_DELTA } from '@speakcoach/shared';

/** Store an anxiety rating and compute response metrics */
export async function recordAnxietyRating(
  prisma: PrismaClient,
  userId: string,
  sessionId: string,
  timing: 'pre' | 'post',
  rating: number
) {
  // TODO: insert anxiety rating record
  // Calculate 7-day rolling average for pre-session ratings
  // Detect spike: rating >= rollingAvg + ANXIETY_SPIKE_DELTA
  // Determine if calming exercise should be shown (spike detected on pre-session)
  // Return AnxietyRatingResponse shape
  return null;
}

/** Get 7-day rolling average for pre-session anxiety ratings */
export async function getRollingAvgPre(prisma: PrismaClient, userId: string): Promise<number> {
  // TODO: query last 7 days of pre-session ratings, calculate average
  return 5.0;
}
