import type { NavigatorScreenParams } from '@react-navigation/native';

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
  Main: NavigatorScreenParams<TabsParamList>;
};
