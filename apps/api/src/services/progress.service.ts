import type { PrismaClient } from '@prisma/client';

/** Aggregate user progress summary: streak, totals, score, days completed */
export async function getProgressSummary(prisma: PrismaClient, userId: string) {
  // 1. Streak data
  const streak = await prisma.streak.findUnique({ where: { userId } });

  // 2. Total completed sessions
  const totalSessions = await prisma.session.count({
    where: { userId, status: 'done' },
  });

  // 3. Average overall score from AnalysisResult
  const analysisResults = await prisma.analysisResult.findMany({
    where: { session: { userId, status: 'done' } },
    select: { scoresJson: true },
  });

  let avgScore = 0;
  if (analysisResults.length > 0) {
    let sum = 0;
    let count = 0;
    for (const ar of analysisResults) {
      const scores = ar.scoresJson as Record<string, unknown> | null;
      if (scores && typeof scores.overall === 'number') {
        sum += scores.overall;
        count++;
      }
    }
    avgScore = count > 0 ? Math.round((sum / count) * 10) / 10 : 0;
  }

  // 4. Distinct days completed (unique dates of completed sessions)
  const completedSessions = await prisma.session.findMany({
    where: { userId, status: 'done' },
    select: { createdAt: true },
  });

  const uniqueDays = new Set(
    completedSessions.map((s) => s.createdAt.toISOString().slice(0, 10)),
  );
  const daysCompleted = uniqueDays.size;

  return {
    streak: {
      current: streak?.currentStreak ?? 0,
      longest: streak?.longestStreak ?? 0,
      lastDate: streak?.lastPracticeDate?.toISOString().slice(0, 10) ?? null,
    },
    totalSessions,
    avgScore,
    daysCompleted,
  };
}

/** Get anxiety trend data for progress dashboard */
export async function getAnxietyTrend(prisma: PrismaClient, userId: string) {
  // Fetch last 30 anxiety ratings ordered by creation date
  const ratings = await prisma.anxietyRating.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 30,
    select: {
      sessionId: true,
      preRating: true,
      postRating: true,
      createdAt: true,
    },
  });

  // Group by date, returning array of { date, pre, post }
  // Reverse so oldest first for charting
  const reversed = [...ratings].reverse();

  const entries = reversed
    .filter((r) => r.preRating != null && r.postRating != null)
    .map((r) => ({
      sessionId: r.sessionId,
      date: r.createdAt.toISOString().slice(0, 10),
      pre: r.preRating!,
      post: r.postRating!,
    }));

  // Calculate rolling averages (last 7 entries)
  const last7 = entries.slice(-7);
  const rollingAvgPre7d =
    last7.length > 0
      ? Math.round((last7.reduce((s, e) => s + e.pre, 0) / last7.length) * 10) / 10
      : 0;
  const rollingAvgPost7d =
    last7.length > 0
      ? Math.round((last7.reduce((s, e) => s + e.post, 0) / last7.length) * 10) / 10
      : 0;

  // All-time averages
  const allTimeAvgPre =
    entries.length > 0
      ? Math.round((entries.reduce((s, e) => s + e.pre, 0) / entries.length) * 10) / 10
      : 0;
  const allTimeAvgPost =
    entries.length > 0
      ? Math.round((entries.reduce((s, e) => s + e.post, 0) / entries.length) * 10) / 10
      : 0;

  return {
    ratings: entries,
    rollingAvgPre7d,
    rollingAvgPost7d,
    allTimeAvgPre,
    allTimeAvgPost,
    milestones: [] as { type: string; message: string; achievedAt: string }[],
  };
}

/** Update user streak after completing a day */
export async function updateStreak(prisma: PrismaClient, userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.streak.findUnique({ where: { userId } });

  if (existing?.lastPracticeDate) {
    const lastDate = new Date(existing.lastPracticeDate);
    lastDate.setHours(0, 0, 0, 0);

    const diffMs = today.getTime() - lastDate.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Same day — no-op
      return existing;
    }

    if (diffDays === 1) {
      // Consecutive day — increment
      const newCurrent = existing.currentStreak + 1;
      const newLongest = Math.max(newCurrent, existing.longestStreak);
      return prisma.streak.update({
        where: { userId },
        data: {
          currentStreak: newCurrent,
          longestStreak: newLongest,
          lastPracticeDate: today,
        },
      });
    }
  }

  // Gap or no prior record — reset to 1
  return prisma.streak.upsert({
    where: { userId },
    create: {
      userId,
      currentStreak: 1,
      longestStreak: Math.max(1, existing?.longestStreak ?? 0),
      lastPracticeDate: today,
    },
    update: {
      currentStreak: 1,
      longestStreak: Math.max(1, existing?.longestStreak ?? 0),
      lastPracticeDate: today,
    },
  });
}
