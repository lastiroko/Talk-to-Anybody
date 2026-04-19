import type { PrismaClient } from '@prisma/client';

/** Fetch all 60 days with the user's completion and lock status */
export async function getPlanOverview(prisma: PrismaClient, userId: string) {
  // Get all plan days ordered by dayNumber
  const planDays = await prisma.planDay.findMany({
    orderBy: { dayNumber: 'asc' },
    select: {
      id: true,
      dayNumber: true,
      title: true,
      assetsJson: true,
    },
  });

  // Get all completed day IDs for this user (sessions with status = 'done' linked to a planDay)
  const completedSessions = await prisma.session.findMany({
    where: {
      userId,
      status: 'done',
      planDayId: { not: null },
    },
    select: { planDayId: true },
  });

  const completedPlanDayIds = new Set(
    completedSessions.map((s: { planDayId: string | null }) => s.planDayId!),
  );

  // Build a set of completed day numbers for unlock logic
  const planDayIdToNumber = new Map(planDays.map((d: { id: string; dayNumber: number }) => [d.id, d.dayNumber]));
  const completedDayNumbers = new Set(
    [...completedPlanDayIds]
      .map((id) => planDayIdToNumber.get(id))
      .filter((n): n is number => n !== undefined),
  );

  return planDays.map((day: any) => {
    const isCompleted = completedPlanDayIds.has(day.id);
    // Day 1 always unlocked; day N unlocked if day N-1 is completed
    const isUnlocked =
      day.dayNumber === 1 || completedDayNumbers.has(day.dayNumber - 1);

    let status: 'locked' | 'unlocked' | 'completed';
    if (isCompleted) {
      status = 'completed';
    } else if (isUnlocked) {
      status = 'unlocked';
    } else {
      status = 'locked';
    }

    // Extract estimatedMinutes from assetsJson
    const assets = day.assetsJson as Record<string, unknown> | null;
    const estimatedMinutes =
      typeof assets?.estimatedMinutes === 'number'
        ? assets.estimatedMinutes
        : null;

    return {
      dayNumber: day.dayNumber,
      title: day.title,
      status,
      estimatedMinutes,
    };
  });
}

/** Fetch full day detail including lesson, exercises, and engine configs */
export async function getPlanDay(prisma: PrismaClient, dayNumber: number) {
  const day = await prisma.planDay.findUnique({
    where: { dayNumber },
  });

  if (!day) return null;

  // exercisesJson is stored as a Json column — Prisma returns it parsed already
  const exercises = day.exercisesJson as unknown[];
  const assets = day.assetsJson as Record<string, unknown> | null;

  return {
    dayNumber: day.dayNumber,
    title: day.title,
    description: day.description,
    difficulty: day.difficulty,
    estimatedMinutes: assets?.estimatedMinutes ?? null,
    durationTargetSec: assets?.durationTargetSec ?? null,
    lessonText: assets?.lessonText ?? null,
    exercises,
    anxietyGate: assets?.anxietyGate ?? null,
    rewardEligibleFormats: assets?.rewardEligibleFormats ?? null,
  };
}

/** Mark a day as complete, update streak, unlock next day */
export async function completeDay(
  prisma: PrismaClient,
  userId: string,
  dayNumber: number,
) {
  // Find the plan day
  const planDay = await prisma.planDay.findUnique({
    where: { dayNumber },
  });

  if (!planDay) {
    return { success: false, error: 'Day not found' };
  }

  // Check if day is unlocked for this user
  const unlocked = await isDayUnlocked(prisma, userId, dayNumber);
  if (!unlocked) {
    return { success: false, error: 'Day is locked' };
  }

  // Check if already completed
  const existing = await prisma.session.findFirst({
    where: {
      userId,
      planDayId: planDay.id,
      status: 'done',
    },
  });

  if (existing) {
    return { success: true, alreadyCompleted: true };
  }

  // Create a completion session
  await prisma.session.create({
    data: {
      userId,
      planDayId: planDay.id,
      mode: 'daily',
      status: 'done',
    },
  });

  // Update streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const streak = await prisma.streak.findUnique({
    where: { userId },
  });

  if (streak) {
    const lastDate = streak.lastPracticeDate
      ? new Date(streak.lastPracticeDate)
      : null;
    if (lastDate) lastDate.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak: number;
    if (lastDate && lastDate.getTime() === today.getTime()) {
      // Already practiced today — no change
      newStreak = streak.currentStreak;
    } else if (lastDate && lastDate.getTime() === yesterday.getTime()) {
      // Practiced yesterday — increment
      newStreak = streak.currentStreak + 1;
    } else {
      // Gap — reset to 1
      newStreak = 1;
    }

    await prisma.streak.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, streak.longestStreak),
        lastPracticeDate: today,
      },
    });
  } else {
    await prisma.streak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastPracticeDate: today,
      },
    });
  }

  return { success: true };
}

/** Check if a user has unlocked a specific day */
export async function isDayUnlocked(
  prisma: PrismaClient,
  userId: string,
  dayNumber: number,
): Promise<boolean> {
  if (dayNumber === 1) return true;

  // Find the previous plan day
  const prevDay = await prisma.planDay.findUnique({
    where: { dayNumber: dayNumber - 1 },
  });

  if (!prevDay) return false;

  // Check if user has a completed session for the previous day
  const completedSession = await prisma.session.findFirst({
    where: {
      userId,
      planDayId: prevDay.id,
      status: 'done',
    },
  });

  return completedSession !== null;
}
