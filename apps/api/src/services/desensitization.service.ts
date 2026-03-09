import type { PrismaClient } from '@prisma/client';

/** Get the user's desensitization ladder status */
export async function getDesensitizationStatus(prisma: PrismaClient, userId: string) {
  // TODO: fetch desensitization_progress for user
  // Build levels array with unlock timestamps
  // Calculate sessions at current level
  // Calculate rolling average post-anxiety at current level
  // Count sessions below threshold
  // Determine if next level is ready (3+ sessions below threshold)
  // Return DesensitizationStatus shape
  return null;
}

/** Check if user meets the minimum desensitization level for a day */
export async function meetsMinLevel(prisma: PrismaClient, userId: string, minLevel: number): Promise<boolean> {
  // TODO: fetch user's current desensitization level
  // Return true if currentLevel >= minLevel
  return minLevel <= 1;
}

/** Advance user to next desensitization level when threshold is met */
export async function advanceLevel(prisma: PrismaClient, userId: string) {
  // TODO: verify 3+ sessions below threshold at current level
  // Increment currentLevel, record unlock timestamp
  // Return updated status
  return null;
}
