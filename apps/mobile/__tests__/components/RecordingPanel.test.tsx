import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('../../src/hooks/useRecording', () => ({
  useRecording: () => ({
    status: 'ready',
    durationSec: 0,
    recordingUri: null,
    error: null,
    startRecording: jest.fn(),
    pauseRecording: jest.fn(),
    resumeRecording: jest.fn(),
    stopRecording: jest.fn(),
    playRecording: jest.fn(),
    stopPlayback: jest.fn(),
    resetRecording: jest.fn(),
  }),
}));

import { RecordingPanel } from '../../src/components/RecordingPanel';

describe('RecordingPanel', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('renders without crashing', () => {
    const { toJSON } = render(
      <RecordingPanel maxDurationSec={60} onRecordingComplete={jest.fn()} />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('shows record button in ready state', () => {
    const { queryByText } = render(
      <RecordingPanel maxDurationSec={60} onRecordingComplete={jest.fn()} />,
    );
    // The recording panel should have some record indicator
    const hasRecordUI = queryByText(/Record|Start|Tap/i);
    expect(hasRecordUI).toBeTruthy();
  });

  it('shows prompt text when provided', () => {
    const { queryByText } = render(
      <RecordingPanel
        maxDurationSec={60}
        onRecordingComplete={jest.fn()}
        promptText="Talk about your day"
      />,
    );
    expect(queryByText('Talk about your day')).toBeTruthy();
  });
});
