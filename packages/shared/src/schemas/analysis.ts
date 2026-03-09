import { z } from 'zod';
import { RewardFormatSchema } from '../enums';

// ── Scores ──────────────────────────────────────────────────────────────────

export const ScoresSchema = z.object({
  overall: z.number().min(0).max(100),
  delivery: z.number().min(0).max(100),
  clarity: z.number().min(0).max(100),
  story: z.number().min(0).max(100),
});
export type Scores = z.infer<typeof ScoresSchema>;

// ── Metrics ─────────────────────────────────────────────────────────────────

export const MetricsSchema = z.object({
  wpm: z.number().nonnegative(),
  fillerPerMin: z.number().nonnegative(),
  avgPauseSec: z.number().nonnegative(),
  pitchRangeHz: z.number().nonnegative(),
  vocalVariety: z.number().min(0).max(100).optional(),
});
export type Metrics = z.infer<typeof MetricsSchema>;

// ── Coaching ────────────────────────────────────────────────────────────────

export const CoachingFixSchema = z.object({
  title: z.string(),
  drillId: z.string(),
});
export type CoachingFix = z.infer<typeof CoachingFixSchema>;

// ── Reward Content (discriminated by format) ────────────────────────────────

export const GoldenInsightContentSchema = z.object({
  title: z.string(),
  body: z.string(),
  ctaLabel: z.string(),
});
export type GoldenInsightContent = z.infer<typeof GoldenInsightContentSchema>;

export const SurpriseChallengeContentSchema = z.object({
  title: z.string(),
  body: z.string(),
  unlockedGameId: z.string(),
  ctaLabel: z.string(),
});
export type SurpriseChallengeContent = z.infer<typeof SurpriseChallengeContentSchema>;

export const CommunityBeforeAfterContentSchema = z.object({
  title: z.string(),
  beforeClipUrl: z.string().url(),
  afterClipUrl: z.string().url(),
  improvementSummary: z.string(),
});
export type CommunityBeforeAfterContent = z.infer<typeof CommunityBeforeAfterContentSchema>;

export const StreakMilestoneContentSchema = z.object({
  title: z.string(),
  body: z.string(),
  streakCount: z.number().int().positive(),
  badgeId: z.string(),
  ctaLabel: z.string(),
});
export type StreakMilestoneContent = z.infer<typeof StreakMilestoneContentSchema>;

/** full_scorecard has null content — client renders from scores/metrics */
export const RewardContentSchema = z.union([
  GoldenInsightContentSchema,
  SurpriseChallengeContentSchema,
  CommunityBeforeAfterContentSchema,
  StreakMilestoneContentSchema,
]);
export type RewardContent = z.infer<typeof RewardContentSchema>;

export const RewardSchema = z.object({
  format: RewardFormatSchema,
  /** null for full_scorecard format */
  content: RewardContentSchema.nullable(),
});
export type Reward = z.infer<typeof RewardSchema>;

// ── Analysis Result ─────────────────────────────────────────────────────────

export const AnalysisResultSchema = z.object({
  scores: ScoresSchema,
  metrics: MetricsSchema,
  wins: z.array(z.string()),
  fixes: z.array(CoachingFixSchema),
  tags: z.array(z.string()),
  coachingText: z.string(),
  reward: RewardSchema.optional(),
});
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
