import { z } from 'zod';
import {
  ExerciseTypeSchema,
  HabitTypeSchema,
  UnlearningPhaseSchema,
  TechniqueTypeSchema,
  ComparisonDimensionSchema,
  LessonTypeSchema,
  RewardFormatSchema,
  SrsDimensionSchema,
} from '../enums';

// ── Lesson ──────────────────────────────────────────────────────────────────

export const LessonSchema = z.object({
  type: LessonTypeSchema,
  content: z.string(),
  assetUrl: z.string().url().nullable(),
});
export type Lesson = z.infer<typeof LessonSchema>;

// ── Unlearning Config ───────────────────────────────────────────────────────

export const UnlearningConfigSchema = z.object({
  habitType: HabitTypeSchema,
  phase: UnlearningPhaseSchema,
  /**
   * Phase-completion gate value.
   * - Detect phase: accuracy ratio 0.0-1.0 (e.g., 0.8 = 80% match)
   * - Disrupt phase: max incidents/min to pass
   * - Replace phase: consecutive clean sessions required (integer)
   */
  detectionThreshold: z.number(),
});
export type UnlearningConfig = z.infer<typeof UnlearningConfigSchema>;

// ── Imitation Config ────────────────────────────────────────────────────────

export const ImitationConfigSchema = z.object({
  expertClipId: z.string(),
  techniqueType: TechniqueTypeSchema,
  /** Overlays shown in side-by-side comparison view */
  comparisonDimensions: z.array(ComparisonDimensionSchema),
});
export type ImitationConfig = z.infer<typeof ImitationConfigSchema>;

// ── Anxiety Gate ────────────────────────────────────────────────────────────

export const AnxietyGateSchema = z.object({
  /** Minimum desensitization ladder level (1-6) required to access this day */
  minLevel: z.number().int().min(1).max(6),
  showPreRating: z.boolean(),
  showPostRating: z.boolean(),
});
export type AnxietyGate = z.infer<typeof AnxietyGateSchema>;

// ── Plan Exercise ───────────────────────────────────────────────────────────

export const PlanExerciseSchema = z.object({
  id: z.string(),
  type: ExerciseTypeSchema,
  prompt: z.string(),
  durationSec: z.number().int().positive(),
  targetMetrics: z.array(z.string()),
  instructions: z.string().optional(),
  maxDurationSec: z.number().int().positive().optional(),
  /** Skill dimensions tracked by SRS for this exercise */
  srsDimensions: z.array(SrsDimensionSchema).optional(),
  /** 0.0-1.0 priority hint for SRS rescheduling. Higher = more aggressively rescheduled on regression. */
  reviewPriority: z.number().min(0).max(1).optional(),
  /** Required when type is 'unlearning_drill' */
  unlearning: UnlearningConfigSchema.optional(),
  /** Required when type is 'imitation_drill' */
  imitation: ImitationConfigSchema.optional(),
});
export type PlanExercise = z.infer<typeof PlanExerciseSchema>;

// ── Plan Day ────────────────────────────────────────────────────────────────

export const PlanDaySchema = z.object({
  dayNumber: z.number().int().min(1).max(60),
  title: z.string(),
  objective: z.string(),
  estimatedMinutes: z.number().int().positive(),
  /** Target total session duration in seconds; follows the micro-commitment curve */
  durationTargetSec: z.number().int().positive().optional(),
  lessonText: z.string(),
  exercises: z.array(PlanExerciseSchema),
  games: z.array(z.string()).optional(),
  anxietyGate: AnxietyGateSchema.optional(),
  /** Allowed post-session reward formats. Defaults to ['full_scorecard'] if omitted. */
  rewardEligibleFormats: z.array(RewardFormatSchema).optional(),
});
export type PlanDay = z.infer<typeof PlanDaySchema>;
