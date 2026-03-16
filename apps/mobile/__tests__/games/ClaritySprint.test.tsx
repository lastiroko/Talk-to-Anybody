import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('../../src/hooks/useProgress', () => ({
  useProgress: () => ({
    progress: { completedDays: [1, 2, 3], currentDayUnlocked: 4, currentStreak: 3, lastPracticeDate: '2026-03-15' },
    loading: false, completeDay: jest.fn(), startDay: jest.fn(), resetProgress: jest.fn(), setProgress: jest.fn(),
  }),
}));

jest.mock('../../src/hooks/usePaywallGate', () => ({
  usePaywallGate: () => ({ isGated: () => false }),
}));

jest.mock('../../src/hooks/useEntryAnimation', () => ({
  useEntryAnimation: () => ({ fadeIn: () => ({}) }),
}));

jest.mock('../../src/storage/gameScores', () => ({
  saveGameScore: jest.fn(),
  getHighScore: jest.fn(() => Promise.resolve(0)),
  getRecentScores: jest.fn(() => Promise.resolve([])),
  getAllHighScores: jest.fn(() => Promise.resolve({})),
}));

import { ClaritySprintScreen } from '../../src/screens/ClaritySprintScreen';

describe('ClaritySprint game', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('renders start screen', () => {
    const { queryByText } = render(<ClaritySprintScreen />);
    expect(queryByText(/Clarity Sprint/i)).toBeTruthy();
  });

  it('shows difficulty options', () => {
    const { queryAllByText } = render(<ClaritySprintScreen />);
    const easyMatches = queryAllByText(/Easy/i);
    expect(easyMatches.length).toBeGreaterThan(0);
  });

  it('renders complete start screen', () => {
    const { toJSON } = render(<ClaritySprintScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it('shows high score display', () => {
    const { queryByText } = render(<ClaritySprintScreen />);
    expect(queryByText(/High Score/i)).toBeTruthy();
  });
});
