import { z } from 'zod';
import { RewardFormatSchema, RewardEngagementActionSchema } from '../enums';

// ── Reward Engagement Request ───────────────────────────────────────────────

export const RewardEngagementRequestSchema = z.object({
  sessionId: z.string(),
  format: RewardFormatSchema,
  action: RewardEngagementActionSchema,
});
export type RewardEngagementRequest = z.infer<typeof RewardEngagementRequestSchema>;

// ── Reward Engagement Response ──────────────────────────────────────────────

export const RewardEngagementResponseSchema = z.object({
  recorded: z.boolean(),
});
export type RewardEngagementResponse = z.infer<typeof RewardEngagementResponseSchema>;

// ── Reward Weights (per-user format preference weights) ─────────────────────

export const RewardWeightsSchema = z.object({
  fullScorecard: z.number().min(0).max(1),
  goldenInsight: z.number().min(0).max(1),
  surpriseChallenge: z.number().min(0).max(1),
  communityBeforeAfter: z.number().min(0).max(1),
  streakMilestone: z.number().min(0).max(1),
});
export type RewardWeights = z.infer<typeof RewardWeightsSchema>;
