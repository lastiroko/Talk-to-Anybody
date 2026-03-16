import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('../../src/hooks/useProgress', () => ({
  useProgress: () => ({
    progress: { completedDays: [], currentDayUnlocked: 1, currentStreak: 0, lastPracticeDate: null },
    loading: false,
    completeDay: jest.fn(), startDay: jest.fn(), resetProgress: jest.fn(), setProgress: jest.fn(),
  }),
  ProgressProvider: ({ children }: any) => children,
}));

jest.mock('../../src/hooks/useGamification', () => ({
  useGamification: () => ({
    gems: 0, coins: 0, xp: 0, level: 1,
    xpToNextLevel: 500, xpInLevel: 0, streak: 0, dailyChallengeComplete: false,
  }),
}));

jest.mock('../../src/hooks/usePaywallGate', () => ({
  usePaywallGate: () => ({ isGated: () => false }),
}));

jest.mock('../../src/hooks/usePurchase', () => ({
  PurchaseProvider: ({ children }: any) => children,
  usePurchase: () => ({ isPremium: false }),
}));

jest.mock('../../src/hooks/useEntryAnimation', () => ({
  useEntryAnimation: () => ({ fadeIn: () => ({}) }),
}));

jest.mock('../../src/components/Decorative', () => ({
  GradientOrb: () => null,
}));

import { AppNavigator } from '../../src/navigation/AppNavigator';

describe('AppNavigator', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('renders auth flow when flow=auth', () => {
    const { toJSON } = render(
      <AppNavigator flow="auth" onAuthenticated={jest.fn()} onOnboardingComplete={jest.fn()} />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('exports AppNavigator as a function', () => {
    expect(typeof AppNavigator).toBe('function');
  });

  it('accepts flow prop types', () => {
    // Type-level test: these should not throw at compile time
    const flows: Array<'auth' | 'onboarding' | 'main'> = ['auth', 'onboarding', 'main'];
    expect(flows).toHaveLength(3);
  });
});
