import type { PrismaClient } from '@prisma/client';

/** Fetch all 60 days with the user's completion and lock status */
export async function getPlanOverview(prisma: PrismaClient, userId: string) {
  // TODO: query plan_days joined with user's completed days, apply unlock logic
  // Return array of { dayNumber, title, estimatedMinutes, isCompleted, isLocked }
  return [];
}

/** Fetch full day detail including lesson, exercises, and engine configs */
export async function getPlanDay(prisma: PrismaClient, dayNumber: number) {
  // TODO: query plan_days by dayNumber, parse exercisesJson, return full PlanDay shape
  return null;
}

/** Mark a day as complete, update streak, unlock next day */
export async function completeDay(prisma: PrismaClient, userId: string, dayNumber: number) {
  // TODO: insert completion record, update streak table, check SRS card creation,
  // unlock next day if sequential, return updated progress state
  return { success: false };
}

/** Check if a user has unlocked a specific day */
export async function isDayUnlocked(prisma: PrismaClient, userId: string, dayNumber: number): Promise<boolean> {
  // TODO: day 1 always unlocked; subsequent days require previous day completed
  return dayNumber === 1;
}
