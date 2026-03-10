import type { PrismaClient } from '@prisma/client';
import { processAnalysisJob } from '../jobs/analysis.job';

/** Orchestrate the full analysis pipeline for a session */
export async function analyzeSession(
  prisma: PrismaClient,
  sessionId: string,
  config: { deepgramApiKey: string; openaiApiKey: string; redisUrl: string },
) {
  // For now, run synchronously (BullMQ integration is opt-in via REDIS_URL)
  // In production with Redis, this would enqueue a job instead
  if (config.redisUrl && config.redisUrl !== 'redis://localhost:6379') {
    // TODO: When BullMQ is configured, enqueue instead of running inline
    // const queue = new Queue('analysis', { connection: parseRedisUrl(config.redisUrl) });
    // await queue.add('analyze', { sessionId });
    // return;
  }

  // Run inline (development / no Redis)
  await processAnalysisJob(prisma, { sessionId }, {
    deepgramApiKey: config.deepgramApiKey,
    openaiApiKey: config.openaiApiKey,
  });
}

/** Fetch a completed analysis result for a session */
export async function getAnalysis(prisma: PrismaClient, sessionId: string, userId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { userId: true },
  });

  if (!session || session.userId !== userId) return null;

  const result = await prisma.analysisResult.findUnique({
    where: { sessionId },
  });

  if (!result) return null;

  const metrics = result.metricsJson as any;
  const scores = result.scoresJson as any;
  const habitMarkers = (result.habitMarkersJson as any[]) || [];

  return {
    scores: {
      overall: scores.overall ?? 0,
      delivery: scores.delivery ?? 0,
      clarity: scores.clarity ?? 0,
      story: scores.story ?? 0,
    },
    metrics: {
      wpm: metrics.wpm ?? 0,
      fillerPerMin: metrics.fillerPerMin ?? 0,
      avgPauseSec: metrics.avgPauseSec ?? 0,
      pitchRangeHz: metrics.pitchRangeHz ?? 0,
      vocalVariety: metrics.vocalVariety ?? 50,
    },
    wins: (scores.wins as string[]) ?? [],
    fixes: (scores.fixes as { title: string; drillId: string }[]) ?? [],
    tags: (scores.tags as string[]) ?? [],
    coachingText: result.coachingText,
    reward: result.rewardFormat
      ? { format: result.rewardFormat, content: result.rewardContentJson }
      : undefined,
  };
}
