import type { PrismaClient } from '@prisma/client';
import type { HabitType, UnlearningPhase } from '@speakcoach/shared';

/** Get unlearning status for all of a user's tracked habits */
export async function getUnlearningStatus(prisma: PrismaClient, userId: string) {
  // TODO: query unlearning_progress for all habits being tracked by this user
  // Return UnlearningStatusResponse shape with phase details per habit
  return { habits: [] };
}

/** Compare user taps against AI-detected markers for accuracy */
export async function compareDetectTaps(
  prisma: PrismaClient,
  sessionId: string,
  habitType: HabitType,
  userTaps: Array<{ timestampSec: number }>
) {
  // TODO: fetch AI-detected markers from analysis_results.habitMarkersJson for this session
  // Compare each user tap against AI markers with ±0.5s tolerance
  // Calculate: matched, missed, false positives, accuracy
  // Determine if phase gate passed (accuracy >= threshold)
  // Return DetectTapResponse shape
  return null;
}

/** Advance a habit to the next unlearning phase */
export async function completePhase(
  prisma: PrismaClient,
  userId: string,
  habitType: HabitType,
  completedPhase: UnlearningPhase
) {
  // TODO: verify the current phase matches completedPhase
  // Advance to next phase: detect → disrupt → replace → done
  // Set new detection_threshold for the new phase
  // Return PhaseCompleteResponse shape (nextPhase is null if replace was completed)
  return null;
}
