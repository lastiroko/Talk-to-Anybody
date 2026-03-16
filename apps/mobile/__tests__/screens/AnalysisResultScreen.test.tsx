import React from 'react';
import { render, act } from '@testing-library/react-native';

jest.mock('../../src/hooks/useEntryAnimation', () => ({
  useEntryAnimation: () => ({ fadeIn: () => ({}) }),
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: { sessionId: 'test_session_1', dayNumber: 1, exerciseId: 'ex1' },
  }),
}));

jest.mock('../../src/services/api', () => ({
  getAnalysis: jest.fn(() =>
    Promise.resolve({
      scores: { overall: 75, delivery: 70, clarity: 80, story: 65 },
      metrics: { wpm: 145, fillerPerMin: 2.0, avgPauseSec: 0.8, pitchRangeHz: 85 },
      wins: ['Strong opening', 'Good pacing'],
      fixes: [{ title: 'Reduce fillers', drillId: 'drill1' }],
      coachingText: 'Great job! Keep it up.',
      reward: { format: 'full_scorecard', content: null },
    }),
  ),
}));

import { AnalysisResultScreen } from '../../src/screens/AnalysisResultScreen';

describe('AnalysisResultScreen', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('renders loading state initially', () => {
    const { queryByText } = render(<AnalysisResultScreen />);
    expect(queryByText('Loading results...')).toBeTruthy();
  });
});
