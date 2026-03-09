import { z } from 'zod';
import { AnxietyTimingSchema, SrsDimensionSchema } from '../enums';

// ── Progress State ──────────────────────────────────────────────────────────

export const ProgressStateSchema = z.object({
  completedDays: z.array(z.number().int().min(1).max(60)),
  currentDayUnlocked: z.number().int().min(1).max(60),
  currentStreak: z.number().int().nonnegative(),
  lastPracticeDate: z.string().nullable(),
});
export type ProgressState = z.infer<typeof ProgressStateSchema>;

// ── Anxiety Rating ──────────────────────────────────────────────────────────

export const AnxietyRatingRequestSchema = z.object({
  timing: AnxietyTimingSchema,
  /** 1 = calm, 5 = nervous, 10 = panicking */
  rating: z.number().int().min(1).max(10),
});
export type AnxietyRatingRequest = z.infer<typeof AnxietyRatingRequestSchema>;

export const AnxietyRatingResponseSchema = z.object({
  sessionId: z.string(),
  timing: AnxietyTimingSchema,
  rating: z.number().int().min(1).max(10),
  rollingAvgPre: z.number(),
  spikeDetected: z.boolean(),
  showCalmingExercise: z.boolean(),
});
export type AnxietyRatingResponse = z.infer<typeof AnxietyRatingResponseSchema>;

// ── Anxiety Trend ───────────────────────────────────────────────────────────

export const AnxietyRatingEntrySchema = z.object({
  sessionId: z.string(),
  date: z.string(),
  pre: z.number().int().min(1).max(10),
  post: z.number().int().min(1).max(10),
});
export type AnxietyRatingEntry = z.infer<typeof AnxietyRatingEntrySchema>;

export const AnxietyMilestoneSchema = z.object({
  type: z.string(),
  message: z.string(),
  achievedAt: z.string(),
});
export type AnxietyMilestone = z.infer<typeof AnxietyMilestoneSchema>;

export const AnxietyTrendSchema = z.object({
  ratings: z.array(AnxietyRatingEntrySchema),
  rollingAvgPre7d: z.number(),
  rollingAvgPost7d: z.number(),
  allTimeAvgPre: z.number(),
  allTimeAvgPost: z.number(),
  milestones: z.array(AnxietyMilestoneSchema),
});
export type AnxietyTrend = z.infer<typeof AnxietyTrendSchema>;

// ── SRS Summary (embedded in ProgressSummary) ───────────────────────────────

export const SrsSummarySchema = z.object({
  activeCards: z.number().int().nonnegative(),
  dueToday: z.number().int().nonnegative(),
  reviewsThisWeek: z.number().int().nonnegative(),
  strongestDimension: SrsDimensionSchema.nullable(),
  weakestDimension: SrsDimensionSchema.nullable(),
});
export type SrsSummary = z.infer<typeof SrsSummarySchema>;

// ── Anxiety Trend Summary (embedded in ProgressSummary) ─────────────────────

export const AnxietyTrendSummarySchema = z.object({
  rollingAvgPre7d: z.number(),
  rollingAvgPost7d: z.number(),
  changeSinceBaseline: z.number(),
  milestoneFlags: z.array(z.string()),
});
export type AnxietyTrendSummary = z.infer<typeof AnxietyTrendSummarySchema>;

// ── Progress Summary ────────────────────────────────────────────────────────

export const ProgressSummarySchema = z.object({
  streak: z.number().int().nonnegative(),
  totalMinutes: z.number().nonnegative(),
  speakingScore: z.number().min(0).max(100),
  trends: z.record(z.string(), z.unknown()),
  anxietyTrend: AnxietyTrendSummarySchema,
  srsSummary: SrsSummarySchema,
});
export type ProgressSummary = z.infer<typeof ProgressSummarySchema>;
