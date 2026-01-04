export type ExerciseType = 'record' | 'drill' | 'game';

export interface PlanExercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  durationSec: number;
  targetMetrics: string[];
}

export interface PlanDay {
  dayNumber: number;
  title: string;
  objective: string;
  estimatedMinutes: number;
  lessonText: string;
  exercises: PlanExercise[];
}

export interface ProgressState {
  completedDays: number[];
  currentDayUnlocked: number;
  currentStreak: number;
  lastPracticeDate: string | null;
}
