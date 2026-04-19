import type { PrismaClient } from '@prisma/client';

const LEVEL_LABELS: Record<number, string> = {
  1: 'Alone, audio only',
  2: 'Audio + AI review',
  3: 'Camera on, private',
  4: 'Camera + AI review',
  5: 'Anonymous community',
  6: 'Live group rooms',
};

const MAX_LEVEL = 6;

/** Get the user's desensitization ladder status */
export async function getDesensitizationStatus(prisma: PrismaClient, userId: string) {
  const progress = await prisma.desensitizationProgress.upsert({
    where: { userId },
    create: {
      userId,
      currentLevel: 1,
      levelUnlockedAt: [{ level: 1, date: new Date().toISOString() }],
    },
    update: {},
  });

  return {
    currentLevel: progress.currentLevel,
    currentLevelLabel: LEVEL_LABELS[progress.currentLevel] ?? 'Unknown',
    maxLevel: MAX_LEVEL,
    unlockedAt: progress.levelUnlockedAt as Array<{ level: number; date: string }>,
    canAdvance: progress.currentLevel < MAX_LEVEL,
  };
}

/** Check if user meets the minimum desensitization level for a day */
export async function meetsMinLevel(prisma: PrismaClient, userId: string, minLevel: number): Promise<boolean> {
  const progress = await prisma.desensitizationProgress.findUnique({
    where: { userId },
  });
  if (!progress) return minLevel <= 1;
  return progress.currentLevel >= minLevel;
}

/** Advance user to next desensitization level when threshold is met */
export async function advanceLevel(prisma: PrismaClient, userId: string) {
  const progress = await prisma.desensitizationProgress.upsert({
    where: { userId },
    create: {
      userId,
      currentLevel: 1,
      levelUnlockedAt: [{ level: 1, date: new Date().toISOString() }],
    },
    update: {},
  });

  if (progress.currentLevel >= MAX_LEVEL) {
    return {
      advanced: false,
      currentLevel: progress.currentLevel,
      currentLevelLabel: LEVEL_LABELS[progress.currentLevel] ?? 'Unknown',
      message: 'Already at maximum level',
    };
  }

  const newLevel = progress.currentLevel + 1;
  const unlockedAt = progress.levelUnlockedAt as Array<{ level: number; date: string }>;
  unlockedAt.push({ level: newLevel, date: new Date().toISOString() });

  const updated = await prisma.desensitizationProgress.update({
    where: { userId },
    data: {
      currentLevel: newLevel,
      levelUnlockedAt: unlockedAt,
    },
  });

  return {
    advanced: true,
    currentLevel: updated.currentLevel,
    currentLevelLabel: LEVEL_LABELS[updated.currentLevel] ?? 'Unknown',
    unlockedAt: updated.levelUnlockedAt as Array<{ level: number; date: string }>,
  };
}
