import { z } from 'zod';

// ── Exercise Types ──────────────────────────────────────────────────────────
export const ExerciseTypeSchema = z.enum([
  'record',
  'quiz',
  'reflection',
  'game',
  'drill',
  'unlearning_drill',
  'imitation_drill',
]);
export type ExerciseType = z.infer<typeof ExerciseTypeSchema>;
export const ExerciseTypes = ExerciseTypeSchema.options;

// ── Habit Types ─────────────────────────────────────────────────────────────
export const HabitTypeSchema = z.enum(['filler', 'uptalk', 'rushing']);
export type HabitType = z.infer<typeof HabitTypeSchema>;
export const HabitTypes = HabitTypeSchema.options;

// ── Unlearning Phases ───────────────────────────────────────────────────────
export const UnlearningPhaseSchema = z.enum(['detect', 'disrupt', 'replace']);
export type UnlearningPhase = z.infer<typeof UnlearningPhaseSchema>;
export const UnlearningPhases = UnlearningPhaseSchema.options;

// ── Session Modes ───────────────────────────────────────────────────────────
export const SessionModeSchema = z.enum([
  'daily',
  'freestyle',
  'script',
  'impromptu',
  'roleplay',
  'game',
]);
export type SessionMode = z.infer<typeof SessionModeSchema>;
export const SessionModes = SessionModeSchema.options;

// ── Session Statuses ────────────────────────────────────────────────────────
export const SessionStatusSchema = z.enum(['queued', 'processing', 'done', 'error']);
export type SessionStatus = z.infer<typeof SessionStatusSchema>;
export const SessionStatuses = SessionStatusSchema.options;

// ── SRS Dimensions ──────────────────────────────────────────────────────────
export const SrsDimensionSchema = z.enum([
  'fillers',
  'pauses',
  'pace',
  'structure',
  'vocal_variety',
  'clarity',
  'storytelling',
]);
export type SrsDimension = z.infer<typeof SrsDimensionSchema>;
export const SrsDimensions = SrsDimensionSchema.options;

// ── Reward Formats ──────────────────────────────────────────────────────────
export const RewardFormatSchema = z.enum([
  'full_scorecard',
  'golden_insight',
  'surprise_challenge',
  'community_before_after',
  'streak_milestone',
]);
export type RewardFormat = z.infer<typeof RewardFormatSchema>;
export const RewardFormats = RewardFormatSchema.options;

// ── Technique Types ─────────────────────────────────────────────────────────
export const TechniqueTypeSchema = z.enum(['pause', 'variety', 'pacing', 'emphasis']);
export type TechniqueType = z.infer<typeof TechniqueTypeSchema>;
export const TechniqueTypes = TechniqueTypeSchema.options;

// ── Comparison Dimensions ───────────────────────────────────────────────────
export const ComparisonDimensionSchema = z.enum(['waveform', 'pace', 'pitch', 'emphasis']);
export type ComparisonDimension = z.infer<typeof ComparisonDimensionSchema>;
export const ComparisonDimensions = ComparisonDimensionSchema.options;

// ── Desensitization Levels ──────────────────────────────────────────────────
export const DesensitizationLevelNumberSchema = z.number().int().min(1).max(6);
export type DesensitizationLevelNumber = z.infer<typeof DesensitizationLevelNumberSchema>;
export const DesensitizationLevels = [1, 2, 3, 4, 5, 6] as const;

// ── Lesson Types ────────────────────────────────────────────────────────────
export const LessonTypeSchema = z.enum(['text', 'audio', 'video']);
export type LessonType = z.infer<typeof LessonTypeSchema>;
export const LessonTypes = LessonTypeSchema.options;

// ── Anxiety Timing ──────────────────────────────────────────────────────────
export const AnxietyTimingSchema = z.enum(['pre', 'post']);
export type AnxietyTiming = z.infer<typeof AnxietyTimingSchema>;

// ── Purchase Platform ───────────────────────────────────────────────────────
export const PurchasePlatformSchema = z.enum(['ios', 'android']);
export type PurchasePlatform = z.infer<typeof PurchasePlatformSchema>;

// ── Plan Type ───────────────────────────────────────────────────────────────
export const PlanTypeSchema = z.enum(['monthly', 'lifetime']);
export type PlanType = z.infer<typeof PlanTypeSchema>;

// ── Purchase Status ─────────────────────────────────────────────────────────
export const PurchaseStatusValueSchema = z.enum(['free', 'paid']);
export type PurchaseStatusValue = z.infer<typeof PurchaseStatusValueSchema>;

// ── SRS Review Actions ──────────────────────────────────────────────────────
export const SrsReviewActionSchema = z.enum(['completed', 'snoozed', 'skipped']);
export type SrsReviewAction = z.infer<typeof SrsReviewActionSchema>;

// ── Reward Engagement Actions ───────────────────────────────────────────────
export const RewardEngagementActionSchema = z.enum([
  'dismissed',
  'viewed',
  'tapped_detail',
  'shared',
]);
export type RewardEngagementAction = z.infer<typeof RewardEngagementActionSchema>;
