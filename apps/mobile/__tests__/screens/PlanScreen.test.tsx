import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('../../src/hooks/useProgress', () => ({
  useProgress: () => ({
    progress: {
      completedDays: [1, 2, 3, 4, 5],
      currentDayUnlocked: 6,
      currentStreak: 5,
      lastPracticeDate: '2026-03-15',
    },
    loading: false,
    completeDay: jest.fn(),
    startDay: jest.fn(),
    resetProgress: jest.fn(),
    setProgress: jest.fn(),
  }),
}));

jest.mock('../../src/hooks/useGamification', () => ({
  useGamification: () => ({
    gems: 25, coins: 500, xp: 250, level: 1,
    xpToNextLevel: 500, xpInLevel: 250, streak: 5, dailyChallengeComplete: false,
  }),
}));

jest.mock('../../src/hooks/usePaywallGate', () => ({
  usePaywallGate: () => ({ isGated: () => false }),
}));

jest.mock('../../src/hooks/useEntryAnimation', () => ({
  useEntryAnimation: () => ({ fadeIn: () => ({}) }),
}));

import { PlanScreen } from '../../src/screens/PlanScreen';

describe('PlanScreen', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<PlanScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it('shows Your Journey title', () => {
    const { queryByText } = render(<PlanScreen />);
    expect(queryByText('Your Journey')).toBeTruthy();
  });

  it('shows progress percentage', () => {
    const { queryByText } = render(<PlanScreen />);
    expect(queryByText('8%')).toBeTruthy(); // 5/60 ≈ 8%
  });

  it('shows day count', () => {
    const { queryByText } = render(<PlanScreen />);
    expect(queryByText('Day 5/60')).toBeTruthy();
  });

  it('shows week sections', () => {
    const { queryByText } = render(<PlanScreen />);
    expect(queryByText('Week 1')).toBeTruthy();
  });

  it('shows completed day checkmarks', () => {
    const { queryAllByText } = render(<PlanScreen />);
    const checks = queryAllByText('\u2713');
    expect(checks.length).toBeGreaterThanOrEqual(5);
  });

  it('shows current day play icon', () => {
    const { queryAllByText } = render(<PlanScreen />);
    const plays = queryAllByText('\u25b6');
    expect(plays.length).toBeGreaterThanOrEqual(1);
  });
});
