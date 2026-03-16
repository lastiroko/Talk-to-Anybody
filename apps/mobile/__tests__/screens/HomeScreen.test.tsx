import React from 'react';
import { render, waitFor } from '@testing-library/react-native';

// Mock hooks before importing component
const mockProgress = {
  completedDays: [1, 2, 3],
  currentDayUnlocked: 4,
  currentStreak: 3,
  lastPracticeDate: '2026-03-15',
};

jest.mock('../../src/hooks/useProgress', () => ({
  useProgress: () => ({
    progress: mockProgress,
    loading: false,
    completeDay: jest.fn(),
    startDay: jest.fn(),
    resetProgress: jest.fn(),
    setProgress: jest.fn(),
  }),
}));

jest.mock('../../src/hooks/useGamification', () => ({
  useGamification: () => ({
    gems: 15, coins: 300, xp: 150, level: 1,
    xpToNextLevel: 500, xpInLevel: 150, streak: 3, dailyChallengeComplete: false,
  }),
}));

jest.mock('../../src/hooks/usePaywallGate', () => ({
  usePaywallGate: () => ({ isGated: () => false }),
}));

jest.mock('../../src/hooks/useEntryAnimation', () => ({
  useEntryAnimation: () => ({
    fadeIn: () => ({}),
  }),
}));

jest.mock('../../src/components/Decorative', () => ({
  GradientOrb: () => null,
}));

import { HomeScreen } from '../../src/screens/HomeScreen';

describe('HomeScreen', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<HomeScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it('shows greeting based on time of day', () => {
    const { queryByText } = render(<HomeScreen />);
    // One of these should be present
    const hasGreeting = queryByText(/Good morning|Good afternoon|Good evening/);
    expect(hasGreeting).toBeTruthy();
  });

  it('shows streak count', () => {
    const { queryByText } = render(<HomeScreen />);
    // Streak badge shows "3"
    expect(queryByText('3')).toBeTruthy();
  });

  it('shows today card with current day info', () => {
    const { queryByText } = render(<HomeScreen />);
    expect(queryByText(/Day 4/)).toBeTruthy();
  });

  it('renders without crashing on default progress', () => {
    // Renders the normal state (progress loaded)
    const { toJSON } = render(<HomeScreen />);
    expect(toJSON()).toBeTruthy();
  });
});
