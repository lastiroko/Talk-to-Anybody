import type { NavigatorScreenParams } from '@react-navigation/native';
import type { PlanExercise } from '../types/progress';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
};

export type OnboardingStackParamList = {
  OnboardingGoal: undefined;
  OnboardingSchedule: undefined;
  Baseline: undefined;
};

export type TabsParamList = {
  Home: undefined;
  Plan: undefined;
  Practice: undefined;
  Progress: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

export type MainStackParamList = {
  Tabs: NavigatorScreenParams<TabsParamList>;
  DayDetail: { dayNumber: number };
  Main: NavigatorScreenParams<TabsParamList>;
  Freestyle: undefined;
  ScriptMode: undefined;
  Impromptu: undefined;
  Roleplay: undefined;
  FillerSwap: undefined;
  PausePunch: undefined;
  ABTBuilder: undefined;
  ClaritySprint: undefined;
  ExerciseRecord: { exercise: PlanExercise; dayNumber: number };
  AnalysisResult: { sessionId: string; exerciseId?: string; dayNumber?: number };
};
