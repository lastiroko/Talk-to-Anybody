import { z } from 'zod';
import { SrsDimensionSchema, SrsReviewActionSchema } from '../enums';

// ── SRS Card ────────────────────────────────────────────────────────────────

export const SrsCardSchema = z.object({
  cardId: z.string(),
  drillId: z.string(),
  dimension: SrsDimensionSchema,
  currentIntervalDays: z.number().int().positive(),
  lastScore: z.number().min(0).max(100),
  reviewCount: z.number().int().nonnegative(),
  reviewPriority: z.number().min(0).max(1),
  nextReviewDate: z.string(),
});
export type SrsCard = z.infer<typeof SrsCardSchema>;

// ── SRS Due Response ────────────────────────────────────────────────────────

export const SrsDueResponseSchema = z.object({
  dueCards: z.array(SrsCardSchema),
  totalDue: z.number().int().nonnegative(),
});
export type SrsDueResponse = z.infer<typeof SrsDueResponseSchema>;

// ── SRS Review Request ──────────────────────────────────────────────────────

export const SrsReviewRequestSchema = z.object({
  cardId: z.string(),
  sessionId: z.string(),
  score: z.number().min(0).max(100),
  action: SrsReviewActionSchema,
});
export type SrsReviewRequest = z.infer<typeof SrsReviewRequestSchema>;

// ── SRS Review Response ─────────────────────────────────────────────────────

export const SrsReviewResponseSchema = z.object({
  cardId: z.string(),
  previousIntervalDays: z.number().int().positive(),
  newIntervalDays: z.number().int().positive(),
  nextReviewDate: z.string(),
  easeFactor: z.number(),
});
export type SrsReviewResponse = z.infer<typeof SrsReviewResponseSchema>;

// ── SRS Stats ───────────────────────────────────────────────────────────────

export const SrsStatsSchema = z.object({
  activeCards: z.number().int().nonnegative(),
  cardsByDimension: z.record(SrsDimensionSchema, z.number().int().nonnegative()),
  reviewsCompletedTotal: z.number().int().nonnegative(),
  reviewsCompletedThisWeek: z.number().int().nonnegative(),
  nextReviewDate: z.string().nullable(),
  averageEaseFactor: z.number(),
});
export type SrsStats = z.infer<typeof SrsStatsSchema>;
