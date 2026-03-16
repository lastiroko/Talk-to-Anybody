import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

const mockCompleteDay = jest.fn();

jest.mock('../../src/hooks/useProgress', () => ({
  useProgress: () => ({
    progress: {
      completedDays: [],
      currentDayUnlocked: 1,
      currentStreak: 0,
      lastPracticeDate: null,
    },
    loading: false,
    completeDay: mockCompleteDay,
    startDay: jest.fn(),
    resetProgress: jest.fn(),
    setProgress: jest.fn(),
  }),
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

jest.mock('../../src/hooks/useEntryAnimation', () => ({
  useEntryAnimation: () => ({ fadeIn: () => ({}) }),
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    setParams: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
  }),
  useRoute: () => ({
    params: { dayNumber: 1 },
  }),
}));

import { DayDetailScreen } from '../../src/screens/DayDetailScreen';

describe('DayDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders day title and objective', () => {
    const { queryByText } = render(<DayDetailScreen />);
    expect(queryByText('Day 1')).toBeTruthy();
  });

  it('shows lesson card with lessonText', () => {
    const { queryByText } = render(<DayDetailScreen />);
    expect(queryByText(/Lesson/)).toBeTruthy();
  });

  it('renders exercises section', () => {
    const { queryByText } = render(<DayDetailScreen />);
    expect(queryByText(/Exercises/)).toBeTruthy();
  });

  it('shows Start buttons on exercise cards', () => {
    const { queryAllByText } = render(<DayDetailScreen />);
    const startButtons = queryAllByText('Start');
    expect(startButtons.length).toBeGreaterThan(0);
  });

  it('shows Complete Day button', () => {
    const { queryByText } = render(<DayDetailScreen />);
    expect(queryByText(/Complete Day/)).toBeTruthy();
  });
});
