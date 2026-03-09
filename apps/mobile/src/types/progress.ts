export type ExerciseType = 'record' | 'drill' | 'game' | 'quiz' | 'reflection' | 'unlearning_drill' | 'imitation_drill';

export interface UnlearningConfig {
  habitType: 'filler' | 'uptalk' | 'rushing';
  phase: 'detect' | 'disrupt' | 'replace';
  detectionThreshold: number;
}

export interface ImitationConfig {
  expertClipId: string;
  techniqueType: 'pause' | 'variety' | 'pacing' | 'emphasis';
  comparisonDimensions: ('waveform' | 'pace' | 'pitch' | 'emphasis')[];
}

export interface PlanExercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  durationSec: number;
  targetMetrics: string[];
  instructions?: string;
  maxDurationSec?: number;
  srsDimensions?: string[];
  reviewPriority?: number;
  unlearning?: UnlearningConfig;
  imitation?: ImitationConfig;
}

export interface AnxietyGate {
  minLevel: number;
  showPreRating: boolean;
  showPostRating: boolean;
}

export interface PlanDay {
  dayNumber: number;
  title: string;
  objective: string;
  estimatedMinutes: number;
  lessonText: string;
  exercises: PlanExercise[];
  durationTargetSec?: number;
  games?: string[];
  anxietyGate?: AnxietyGate;
  rewardEligibleFormats?: string[];
}

export interface ProgressState {
  completedDays: number[];
  currentDayUnlocked: number;
  currentStreak: number;
  lastPracticeDate: string | null;
}
