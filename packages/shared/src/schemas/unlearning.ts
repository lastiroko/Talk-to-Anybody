import { z } from 'zod';
import { HabitTypeSchema, UnlearningPhaseSchema } from '../enums';

// ── Unlearning Habit Status ─────────────────────────────────────────────────

export const UnlearningHabitStatusSchema = z.object({
  habitType: HabitTypeSchema,
  currentPhase: UnlearningPhaseSchema,
  phaseStartedAt: z.string().datetime(),
  phasesCompleted: z.array(UnlearningPhaseSchema),
  /** Detection accuracy from detect phase (retained for reference) */
  detectionAccuracy: z.number().min(0).max(1),
  /** Consecutive clean sessions count for replace phase tracking */
  consecutiveCleanSessions: z.number().int().nonnegative(),
  /** Current phase gate value */
  detectionThreshold: z.number(),
});
export type UnlearningHabitStatus = z.infer<typeof UnlearningHabitStatusSchema>;

// ── Unlearning Status Response ──────────────────────────────────────────────

export const UnlearningStatusResponseSchema = z.object({
  habits: z.array(UnlearningHabitStatusSchema),
});
export type UnlearningStatusResponse = z.infer<typeof UnlearningStatusResponseSchema>;

// ── Detect Tap Request ──────────────────────────────────────────────────────

export const UserTapSchema = z.object({
  timestampSec: z.number().nonnegative(),
});
export type UserTap = z.infer<typeof UserTapSchema>;

export const DetectTapRequestSchema = z.object({
  sessionId: z.string(),
  habitType: HabitTypeSchema,
  userTaps: z.array(UserTapSchema),
});
export type DetectTapRequest = z.infer<typeof DetectTapRequestSchema>;

// ── AI Marker ───────────────────────────────────────────────────────────────

export const AiMarkerSchema = z.object({
  timestampSec: z.number().nonnegative(),
  word: z.string(),
});
export type AiMarker = z.infer<typeof AiMarkerSchema>;

// ── Detect Tap Response ─────────────────────────────────────────────────────

export const DetectTapResponseSchema = z.object({
  aiDetectedCount: z.number().int().nonnegative(),
  userTappedCount: z.number().int().nonnegative(),
  /** User taps that matched an AI-detected marker (within tolerance) */
  matched: z.number().int().nonnegative(),
  /** AI-detected markers the user didn't tap */
  missed: z.number().int().nonnegative(),
  /** User taps with no matching AI marker */
  falsePositives: z.number().int().nonnegative(),
  /** matched / aiDetectedCount */
  accuracy: z.number().min(0).max(1),
  threshold: z.number(),
  /** Whether accuracy meets or exceeds threshold */
  phasePassed: z.boolean(),
  aiMarkers: z.array(AiMarkerSchema),
});
export type DetectTapResponse = z.infer<typeof DetectTapResponseSchema>;

// ── Phase Complete Request ──────────────────────────────────────────────────

export const PhaseCompleteRequestSchema = z.object({
  habitType: HabitTypeSchema,
  completedPhase: UnlearningPhaseSchema,
});
export type PhaseCompleteRequest = z.infer<typeof PhaseCompleteRequestSchema>;

// ── Phase Complete Response ─────────────────────────────────────────────────

export const PhaseCompleteResponseSchema = z.object({
  habitType: HabitTypeSchema,
  completedPhase: UnlearningPhaseSchema,
  /** null if replace was completed (habit fully unlearned) */
  nextPhase: UnlearningPhaseSchema.nullable(),
  phaseStartedAt: z.string().datetime(),
  detectionThreshold: z.number(),
});
export type PhaseCompleteResponse = z.infer<typeof PhaseCompleteResponseSchema>;
