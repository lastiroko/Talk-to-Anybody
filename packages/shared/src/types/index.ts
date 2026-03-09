// Re-export all inferred types from schemas
// Types are co-located with their schemas and re-exported here for convenience.

export type { Lesson, UnlearningConfig, ImitationConfig, AnxietyGate, PlanExercise, PlanDay } from '../schemas/plan';
export type { CreateSessionRequest, Session, Recording } from '../schemas/session';
export type {
  Scores,
  Metrics,
  CoachingFix,
  GoldenInsightContent,
  SurpriseChallengeContent,
  CommunityBeforeAfterContent,
  StreakMilestoneContent,
  RewardContent,
  Reward,
  AnalysisResult,
} from '../schemas/analysis';
export type {
  ProgressState,
  AnxietyRatingRequest,
  AnxietyRatingResponse,
  AnxietyRatingEntry,
  AnxietyMilestone,
  AnxietyTrend,
  SrsSummary,
  AnxietyTrendSummary,
  ProgressSummary,
} from '../schemas/progress';
export type { SrsCard, SrsDueResponse, SrsReviewRequest, SrsReviewResponse, SrsStats } from '../schemas/srs';
export type {
  UnlearningHabitStatus,
  UnlearningStatusResponse,
  UserTap,
  DetectTapRequest,
  AiMarker,
  DetectTapResponse,
  PhaseCompleteRequest,
  PhaseCompleteResponse,
} from '../schemas/unlearning';
export type { DesensitizationLevel, DesensitizationStatus } from '../schemas/desensitization';
export type { User, SignupRequest, LoginRequest, AuthResponse } from '../schemas/auth';
export type { PurchaseVerifyRequest, PurchaseStatus } from '../schemas/purchase';
export type { RewardEngagementRequest, RewardEngagementResponse, RewardWeights } from '../schemas/rewards';
export type { ImitationCompareRequest, WaveformComparison, PaceComparison, ComparisonData, ImitationCompareResponse } from '../schemas/imitation';
export type { PaceProfile, PitchProfile, ExpertClipDetail } from '../schemas/expert-clips';

// Re-export enum types
export type {
  ExerciseType,
  HabitType,
  UnlearningPhase,
  SessionMode,
  SessionStatus,
  SrsDimension,
  RewardFormat,
  TechniqueType,
  ComparisonDimension,
  DesensitizationLevelNumber,
  LessonType,
  AnxietyTiming,
  PurchasePlatform,
  PlanType,
  PurchaseStatusValue,
  SrsReviewAction,
  RewardEngagementAction,
} from '../enums';
