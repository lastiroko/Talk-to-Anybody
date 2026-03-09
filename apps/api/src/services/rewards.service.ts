import type { PrismaClient } from '@prisma/client';
import type { RewardFormat, RewardEngagementAction } from '@speakcoach/shared';

/** Select a reward format for a session based on user weights and eligibility */
export async function selectRewardFormat(
  prisma: PrismaClient,
  userId: string,
  eligibleFormats: RewardFormat[]
): Promise<RewardFormat> {
  // TODO: fetch user's reward weights from reward_weights table
  // Filter to only eligible formats for this day
  // Apply weighted random selection (higher weight = higher probability)
  // Apply rules: streak_milestone only on milestone days, community_before_after only at level 5+
  // Return selected format
  return 'full_scorecard';
}

/** Generate reward content for a specific format */
export async function generateRewardContent(
  prisma: PrismaClient,
  userId: string,
  sessionId: string,
  format: RewardFormat
) {
  // TODO: generate format-specific content:
  // - full_scorecard: return null (client renders from scores/metrics)
  // - golden_insight: generate single deep observation via LLM
  // - surprise_challenge: select unlocked game, generate challenge text
  // - community_before_after: fetch before/after clips, generate summary
  // - streak_milestone: calculate streak count, assign badge
  return null;
}

/** Record user engagement with a reward and update weights */
export async function recordEngagement(
  prisma: PrismaClient,
  userId: string,
  sessionId: string,
  format: RewardFormat,
  action: RewardEngagementAction
) {
  // TODO: insert into reward_history
  // Update reward_weights: increase weight for formats with positive engagement,
  // decrease for dismissed formats
  // Weight update formula: weight += 0.1 * (actionScore - 0.5) where
  // actionScore = { dismissed: 0, viewed: 0.3, tapped_detail: 0.7, shared: 1.0 }
  return { recorded: true };
}
