import type { PrismaClient } from '@prisma/client';
import type { SrsDimension } from '@speakcoach/shared';

// ── SM-2 helpers ────────────────────────────────────────────────────────────

/**
 * Map a 0-100 score to the SM-2 quality grade (0-5).
 *   0-19 → 0 (complete blackout)
 *  20-39 → 1 (wrong, but remembered upon seeing answer)
 *  40-59 → 2 (wrong, but easy to recall)
 *  60-69 → 3 (correct with difficulty)
 *  70-84 → 4 (correct with hesitation)
 *  85-100→ 5 (perfect)
 */
function scoreToQuality(score: number): number {
  if (score < 20) return 0;
  if (score < 40) return 1;
  if (score < 60) return 2;
  if (score < 70) return 3;
  if (score < 85) return 4;
  return 5;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function startOfToday(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

function startOfWeek(): Date {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const diff = now.getDate() - day;
  const d = new Date(now);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// ── Service functions ───────────────────────────────────────────────────────

/** Get all SRS cards due for review today, ordered by priority */
export async function getSrsDueCards(prisma: PrismaClient, userId: string) {
  const now = new Date();

  const dueCards = await prisma.srsCard.findMany({
    where: {
      userId,
      nextReviewDate: { lte: now },
    },
    orderBy: [
      { reviewPriority: 'desc' },
      { nextReviewDate: 'asc' },
    ],
    take: 10,
  });

  const totalDue = await prisma.srsCard.count({
    where: {
      userId,
      nextReviewDate: { lte: now },
    },
  });

  return {
    dueCards: dueCards.map((card) => ({
      cardId: card.id,
      drillId: card.drillId,
      dimension: card.dimension,
      currentIntervalDays: card.currentIntervalDays,
      lastScore: card.lastScore,
      reviewCount: card.reviewCount,
      reviewPriority: card.reviewPriority,
      nextReviewDate: card.nextReviewDate.toISOString(),
    })),
    totalDue,
  };
}

/**
 * Process a review result using the SM-2 algorithm.
 *
 * SM-2 rules (adapted for 0-100 score → 0-5 quality):
 *   quality 0-2: reset interval to 1, keep ease factor (min 1.3)
 *   quality 3:   repeat with same interval
 *   quality 4-5: interval = interval * easeFactor, ease += 0.1 * (quality - 3)
 *
 * Ease factor adjustment (always applied):
 *   EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
 *   EF' = max(1.3, EF')
 *
 * Actions:
 *   'completed' → apply SM-2 normally
 *   'snoozed'   → reschedule to tomorrow, no other changes
 *   'skipped'   → reset interval to 1 day
 */
export async function processReview(
  prisma: PrismaClient,
  userId: string,
  cardId: string,
  sessionId: string,
  score: number,
  action: 'completed' | 'snoozed' | 'skipped',
) {
  const card = await prisma.srsCard.findFirst({
    where: { id: cardId, userId },
  });

  if (!card) {
    throw new Error('Card not found');
  }

  const previousInterval = card.currentIntervalDays;
  let newInterval = card.currentIntervalDays;
  let newEase = card.easeFactor;
  const now = new Date();

  if (action === 'snoozed') {
    // Reschedule to tomorrow, no SM-2 changes
    newInterval = card.currentIntervalDays; // keep same
    const nextReview = addDays(startOfToday(), 1);

    const updated = await prisma.srsCard.update({
      where: { id: cardId },
      data: {
        nextReviewDate: nextReview,
        lastScore: score,
      },
    });

    return {
      cardId: updated.id,
      previousIntervalDays: previousInterval,
      newIntervalDays: newInterval,
      nextReviewDate: nextReview.toISOString(),
      easeFactor: updated.easeFactor,
    };
  }

  if (action === 'skipped') {
    // Reset interval to 1 day
    newInterval = 1;
    const nextReview = addDays(startOfToday(), 1);

    const updated = await prisma.srsCard.update({
      where: { id: cardId },
      data: {
        currentIntervalDays: newInterval,
        nextReviewDate: nextReview,
        lastScore: score,
        reviewCount: { increment: 1 },
      },
    });

    return {
      cardId: updated.id,
      previousIntervalDays: previousInterval,
      newIntervalDays: newInterval,
      nextReviewDate: nextReview.toISOString(),
      easeFactor: updated.easeFactor,
    };
  }

  // action === 'completed' → full SM-2 algorithm
  const quality = scoreToQuality(score);

  // Update ease factor using SM-2 formula
  newEase = newEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEase = Math.max(1.3, newEase);

  // Update interval
  if (quality < 3) {
    // Failed — reset interval to 1
    newInterval = 1;
  } else if (quality === 3) {
    // Barely passed — repeat with same interval
    newInterval = card.currentIntervalDays;
  } else {
    // quality 4-5 — grow the interval
    if (card.reviewCount === 0) {
      newInterval = 1;
    } else if (card.reviewCount === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(card.currentIntervalDays * newEase);
    }
  }

  // Ensure interval is at least 1
  newInterval = Math.max(1, newInterval);

  const nextReview = addDays(startOfToday(), newInterval);

  const updated = await prisma.srsCard.update({
    where: { id: cardId },
    data: {
      currentIntervalDays: newInterval,
      easeFactor: newEase,
      nextReviewDate: nextReview,
      lastScore: score,
      reviewCount: { increment: 1 },
    },
  });

  return {
    cardId: updated.id,
    previousIntervalDays: previousInterval,
    newIntervalDays: newInterval,
    nextReviewDate: nextReview.toISOString(),
    easeFactor: updated.easeFactor,
  };
}

/**
 * Create SRS cards for weak dimensions after analysis.
 * Only creates cards for dimensions with score < 70.
 * Priority is set based on how far below 70 the score is (normalized 0-1).
 * If a card already exists for that userId+drillId+dimension, update priority.
 */
export async function createCardsForSession(
  prisma: PrismaClient,
  userId: string,
  dimensions: { dimension: SrsDimension; drillId: string; score: number }[],
) {
  const results = [];

  for (const { dimension, drillId, score } of dimensions) {
    if (score >= 70) continue;

    // Priority: how far below 70, normalized to 0-1
    const priority = Math.min(1, Math.max(0, (70 - score) / 70));

    const card = await prisma.srsCard.upsert({
      where: {
        userId_drillId_dimension: {
          userId,
          drillId,
          dimension,
        },
      },
      update: {
        reviewPriority: priority,
        lastScore: score,
      },
      create: {
        userId,
        drillId,
        dimension,
        currentIntervalDays: 1,
        easeFactor: 2.5,
        nextReviewDate: addDays(startOfToday(), 1),
        lastScore: score,
        reviewCount: 0,
        reviewPriority: priority,
      },
    });

    results.push(card);
  }

  return results;
}

/** Get aggregated SRS stats for the progress dashboard */
export async function getSrsStats(prisma: PrismaClient, userId: string) {
  const now = new Date();
  const weekStart = startOfWeek();

  // Total active cards
  const activeCards = await prisma.srsCard.count({
    where: { userId },
  });

  // Cards grouped by dimension
  const byDimension = await prisma.srsCard.groupBy({
    by: ['dimension'],
    where: { userId },
    _count: { id: true },
  });

  const cardsByDimension: Record<string, number> = {};
  for (const row of byDimension) {
    cardsByDimension[row.dimension] = row._count.id;
  }

  // Total reviews completed (sum of reviewCount across all cards)
  const reviewAgg = await prisma.srsCard.aggregate({
    where: { userId },
    _sum: { reviewCount: true },
    _avg: { easeFactor: true },
  });

  const reviewsCompletedTotal = reviewAgg._sum.reviewCount ?? 0;
  const averageEaseFactor = reviewAgg._avg.easeFactor ?? 2.5;

  // Reviews this week: count cards updated this week with reviewCount > 0
  // Since we don't have a separate review log table, we approximate by counting
  // cards that were updated this week (updatedAt >= weekStart).
  const reviewedThisWeek = await prisma.srsCard.count({
    where: {
      userId,
      updatedAt: { gte: weekStart },
      reviewCount: { gt: 0 },
    },
  });

  // Next review date
  const nextCard = await prisma.srsCard.findFirst({
    where: { userId },
    orderBy: { nextReviewDate: 'asc' },
    select: { nextReviewDate: true },
  });

  return {
    activeCards,
    cardsByDimension,
    reviewsCompletedTotal,
    reviewsCompletedThisWeek: reviewedThisWeek,
    nextReviewDate: nextCard?.nextReviewDate?.toISOString() ?? null,
    averageEaseFactor: Math.round(averageEaseFactor * 100) / 100,
  };
}
