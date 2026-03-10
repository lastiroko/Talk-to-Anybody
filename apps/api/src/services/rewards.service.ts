import type { PrismaClient } from '@prisma/client';
import type { RewardFormat, RewardEngagementAction } from '@speakcoach/shared';

/** Select a reward format for a session based on user weights and eligibility */
export async function selectRewardFormat(
  prisma: PrismaClient,
  userId: string,
  eligibleFormats: RewardFormat[],
): Promise<RewardFormat> {
  // Fetch user's reward weights from reward_weights table
  const weights = await prisma.rewardWeight.findMany({
    where: { userId },
  });

  // If no weights exist, return the first eligible format
  if (weights.length === 0) {
    return eligibleFormats[0] || 'full_scorecard';
  }

  // Filter to only eligible formats
  const eligible = weights.filter((w) =>
    eligibleFormats.includes(w.formatType as RewardFormat),
  );

  if (eligible.length === 0) {
    return eligibleFormats[0] || 'full_scorecard';
  }

  // Apply weighted random selection (higher weight = higher probability)
  const totalWeight = eligible.reduce((sum, w) => sum + w.weight, 0);
  let random = Math.random() * totalWeight;

  for (const w of eligible) {
    random -= w.weight;
    if (random <= 0) {
      return w.formatType as RewardFormat;
    }
  }

  return eligible[eligible.length - 1].formatType as RewardFormat;
}

/** Generate reward content for a specific format */
export async function generateRewardContent(
  prisma: PrismaClient,
  userId: string,
  sessionId: string,
  format: RewardFormat,
) {
  switch (format) {
    case 'full_scorecard':
      // Client renders from scores/metrics — no extra content needed
      return null;

    case 'golden_insight':
      // TODO: generate single deep observation via LLM
      return {
        title: 'Golden Insight',
        body: 'Your strongest moment was in the opening — you captured attention immediately. Build on this by varying your pace more in the middle section.',
        ctaLabel: 'Try a pacing drill',
      };

    case 'surprise_challenge':
      // TODO: select unlocked game, generate challenge text
      return {
        title: 'Surprise Challenge',
        body: 'Can you deliver your next practice with zero filler words? Take the challenge!',
        unlockedGameId: 'filler_free_challenge',
        ctaLabel: 'Accept Challenge',
      };

    case 'community_before_after':
      // TODO: fetch before/after clips, generate summary
      return {
        title: 'See Your Progress',
        beforeClipUrl: '',
        afterClipUrl: '',
        improvementSummary: 'Your filler word usage has dropped 40% since you started!',
      };

    case 'streak_milestone': {
      // Calculate streak count
      const streak = await prisma.streak.findUnique({
        where: { userId },
      });
      const streakCount = streak?.currentStreak ?? 1;
      return {
        title: `${streakCount}-Day Streak!`,
        body: `You've practiced ${streakCount} days in a row. Keep the momentum going!`,
        streakCount,
        badgeId: streakCount >= 30 ? 'streak_30' : streakCount >= 7 ? 'streak_7' : 'streak_3',
        ctaLabel: 'Keep Going',
      };
    }

    default:
      return null;
  }
}

/** Record user engagement with a reward and update weights */
export async function recordEngagement(
  prisma: PrismaClient,
  userId: string,
  sessionId: string,
  format: RewardFormat,
  action: RewardEngagementAction,
) {
  // Insert into reward_history
  await prisma.rewardHistory.create({
    data: {
      userId,
      sessionId,
      formatShown: format as any,
      engagementAction: action as any,
    },
  });

  // Weight update formula: weight += 0.1 * (actionScore - 0.5)
  const actionScores: Record<string, number> = {
    dismissed: 0,
    viewed: 0.3,
    tapped_detail: 0.7,
    shared: 1.0,
  };

  const actionScore = actionScores[action] ?? 0.3;
  const weightDelta = 0.1 * (actionScore - 0.5);

  // Upsert reward weight for this format
  await prisma.rewardWeight.upsert({
    where: {
      userId_formatType: {
        userId,
        formatType: format as any,
      },
    },
    update: {
      weight: { increment: weightDelta },
      lastShownAt: new Date(),
      engagementScore: actionScore,
    },
    create: {
      userId,
      formatType: format as any,
      weight: Math.max(0, 0.2 + weightDelta),
      lastShownAt: new Date(),
      engagementScore: actionScore,
    },
  });

  return { recorded: true };
}
