import type { PrismaClient } from '@prisma/client';
import type { HabitType, UnlearningPhase } from '@speakcoach/shared';

const ALL_HABITS: HabitType[] = ['filler', 'uptalk', 'rushing'];
const PHASE_ORDER: UnlearningPhase[] = ['detect', 'disrupt', 'replace'];
const DEFAULT_THRESHOLD = 0.8;
const CONSECUTIVE_CLEAN_SESSIONS_TO_ADVANCE = 3;

/** Get unlearning status for all of a user's tracked habits */
export async function getUnlearningStatus(prisma: PrismaClient, userId: string) {
  // Ensure default records exist for all habit types
  for (const habitType of ALL_HABITS) {
    await prisma.unlearningProgress.upsert({
      where: { userId_habitType: { userId, habitType } },
      create: {
        userId,
        habitType,
        currentPhase: 'detect',
        detectionAccuracy: 0,
        consecutiveCleanSessions: 0,
        detectionThreshold: DEFAULT_THRESHOLD,
      },
      update: {},
    });
  }

  const habits = await prisma.unlearningProgress.findMany({
    where: { userId },
    orderBy: { habitType: 'asc' },
  });

  return {
    habits: habits.map((h) => ({
      habitType: h.habitType,
      phase: h.currentPhase,
      detectionAccuracy: h.detectionAccuracy,
      consecutiveCleanSessions: h.consecutiveCleanSessions,
      threshold: h.detectionThreshold,
      phaseStartedAt: h.phaseStartedAt.toISOString(),
    })),
  };
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

/** Update progress for a specific habit after a session */
export async function updateProgress(
  prisma: PrismaClient,
  userId: string,
  habitType: HabitType,
  detectionAccuracy: number,
  isClean: boolean,
) {
  // Ensure record exists
  const progress = await prisma.unlearningProgress.upsert({
    where: { userId_habitType: { userId, habitType } },
    create: {
      userId,
      habitType,
      currentPhase: 'detect',
      detectionAccuracy,
      consecutiveCleanSessions: isClean ? 1 : 0,
      detectionThreshold: DEFAULT_THRESHOLD,
    },
    update: {
      detectionAccuracy,
      consecutiveCleanSessions: isClean
        ? { increment: 1 }
        : 0,
    },
  });

  // Re-fetch to get the updated consecutiveCleanSessions value
  const updated = await prisma.unlearningProgress.findUniqueOrThrow({
    where: { userId_habitType: { userId, habitType } },
  });

  // Check if we should advance to next phase
  let advanced = false;
  let newPhase = updated.currentPhase;

  if (updated.consecutiveCleanSessions >= CONSECUTIVE_CLEAN_SESSIONS_TO_ADVANCE) {
    const currentIndex = PHASE_ORDER.indexOf(updated.currentPhase as UnlearningPhase);
    if (currentIndex < PHASE_ORDER.length - 1) {
      newPhase = PHASE_ORDER[currentIndex + 1];
      advanced = true;

      await prisma.unlearningProgress.update({
        where: { userId_habitType: { userId, habitType } },
        data: {
          currentPhase: newPhase,
          consecutiveCleanSessions: 0,
          phaseStartedAt: new Date(),
        },
      });
    }
  }

  return {
    habitType,
    phase: newPhase,
    detectionAccuracy: updated.detectionAccuracy,
    consecutiveCleanSessions: advanced ? 0 : updated.consecutiveCleanSessions,
    threshold: updated.detectionThreshold,
    phaseAdvanced: advanced,
  };
}
