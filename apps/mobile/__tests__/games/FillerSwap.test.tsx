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

import { FillerSwapScreen } from '../../src/screens/FillerSwapScreen';

describe('FillerSwap game', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('renders start screen with instructions', () => {
    const { queryByText } = render(<FillerSwapScreen />);
    expect(queryByText(/Filler Swap/i)).toBeTruthy();
  });

  it('has a start/play button', () => {
    const { queryByText } = render(<FillerSwapScreen />);
    const startBtn = queryByText(/Start|Play|Begin/i);
    expect(startBtn).toBeTruthy();
  });

  it('shows high score display', () => {
    const { queryByText } = render(<FillerSwapScreen />);
    expect(queryByText(/High Score|Best/i)).toBeTruthy();
  });
});
