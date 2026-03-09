import type { PrismaClient } from '@prisma/client';

/** Get all SRS cards due for review today, ordered by priority */
export async function getSrsDueCards(prisma: PrismaClient, userId: string) {
  // TODO: query srs_cards where userId matches AND nextReviewDate <= today
  // Order by reviewPriority DESC, then nextReviewDate ASC
  // Return SrsDueResponse shape
  return { dueCards: [], totalDue: 0 };
}

/** Process a review result and update the card's interval */
export async function processReview(
  prisma: PrismaClient,
  userId: string,
  cardId: string,
  sessionId: string,
  score: number,
  action: 'completed' | 'snoozed' | 'skipped'
) {
  // TODO: implement Ebbinghaus scheduling rules:
  // - Score >= previous + threshold → interval doubles
  // - Score < previous - threshold → interval halves (min 1 day)
  // - action 'snoozed' → reschedule to tomorrow (allowed once per card)
  // - action 'skipped' (second skip) → reset interval to 1 day
  // Update card fields: currentIntervalDays, lastScore, reviewCount, nextReviewDate, easeFactor
  // Return SrsReviewResponse shape
  return null;
}

/** Create SRS cards for a completed exercise's dimensions */
export async function createCardsForExercise(
  prisma: PrismaClient,
  userId: string,
  drillId: string,
  dimensions: string[],
  score: number,
  reviewPriority: number
) {
  // TODO: for each dimension, create or update an SRS card
  // Initial interval: 1 day, easeFactor: 2.5
  // If card already exists for this drill+dimension, update lastScore
  return [];
}

/** Get aggregated SRS stats for the progress dashboard */
export async function getSrsStats(prisma: PrismaClient, userId: string) {
  // TODO: count active cards total and per dimension
  // Count reviews completed total and this week
  // Find next review date
  // Calculate average ease factor
  // Return SrsStats shape
  return null;
}
