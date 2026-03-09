import type { PrismaClient } from '@prisma/client';

/** Aggregate user progress summary: streak, totals, trends, anxiety, SRS */
export async function getProgressSummary(prisma: PrismaClient, userId: string) {
  // TODO: query streaks table for current streak
  // Query sessions for total minutes
  // Query analysis_results for latest speaking score
  // Calculate WPM/filler/score trends over time
  // Aggregate anxiety trend summary (rolling averages, change since baseline)
  // Aggregate SRS summary (active cards, due today, strongest/weakest dimension)
  // Return ProgressSummary shape
  return null;
}

/** Get full anxiety trend data for progress dashboard */
export async function getAnxietyTrend(prisma: PrismaClient, userId: string) {
  // TODO: query anxiety_ratings for all user ratings
  // Calculate 7-day rolling averages for pre and post
  // Calculate all-time averages
  // Detect milestones (avg drops, first below-4 post rating, etc.)
  // Return AnxietyTrend shape
  return null;
}

/** Update user streak after completing a day */
export async function updateStreak(prisma: PrismaClient, userId: string) {
  // TODO: check lastPracticeDate vs today
  // If consecutive day: increment currentStreak
  // If same day: no change
  // If gap: reset currentStreak to 1
  // Update longestStreak if currentStreak > longestStreak
  return null;
}
