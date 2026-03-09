import { z } from 'zod';
import { TechniqueTypeSchema, ComparisonDimensionSchema } from '../enums';

// ── Imitation Compare Request ───────────────────────────────────────────────

export const ImitationCompareRequestSchema = z.object({
  sessionId: z.string(),
  expertClipId: z.string(),
  comparisonDimensions: z.array(ComparisonDimensionSchema),
});
export type ImitationCompareRequest = z.infer<typeof ImitationCompareRequestSchema>;

// ── Comparison Data ─────────────────────────────────────────────────────────

export const WaveformComparisonSchema = z.object({
  expert: z.array(z.number()),
  user: z.array(z.number()),
});
export type WaveformComparison = z.infer<typeof WaveformComparisonSchema>;

export const PaceComparisonSchema = z.object({
  expertWpm: z.array(z.number()),
  userWpm: z.array(z.number()),
});
export type PaceComparison = z.infer<typeof PaceComparisonSchema>;

export const ComparisonDataSchema = z.object({
  waveform: WaveformComparisonSchema.optional(),
  pace: PaceComparisonSchema.optional(),
  pitch: z.record(z.string(), z.array(z.number())).optional(),
  emphasis: z.record(z.string(), z.array(z.number())).optional(),
});
export type ComparisonData = z.infer<typeof ComparisonDataSchema>;

// ── Imitation Compare Response ──────────────────────────────────────────────

export const ImitationCompareResponseSchema = z.object({
  expertClipId: z.string(),
  /** Overall similarity score 0-100 */
  similarityScore: z.number().min(0).max(100),
  /** Per-dimension scores */
  dimensionScores: z.record(ComparisonDimensionSchema, z.number().min(0).max(100)),
  comparisonData: ComparisonDataSchema,
  feedback: z.string(),
});
export type ImitationCompareResponse = z.infer<typeof ImitationCompareResponseSchema>;
