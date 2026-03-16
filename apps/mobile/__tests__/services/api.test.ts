import {
  createSession,
  getUploadUrl,
  uploadRecording,
  submitSession,
  getSessionStatus,
  getAnalysis,
  submitAnxietyRating,
} from '../../src/services/api';

describe('API service', () => {
  it('createSession returns mock session with id and status', async () => {
    const result = await createSession('free_talk');
    expect(result.id).toMatch(/^mock_session_\d+$/);
    expect(result.status).toBe('queued');
  });

  it('getUploadUrl returns mock URL and key', async () => {
    const result = await getUploadUrl('session_123');
    expect(result.uploadUrl).toBe('https://mock-s3.example.com/upload');
    expect(result.key).toBe('recordings/session_123.m4a');
  });

  it('uploadRecording resolves after delay', async () => {
    const start = Date.now();
    const result = await uploadRecording(
      'https://mock-s3.example.com/upload',
      'file:///mock/recording.m4a',
    );
    const elapsed = Date.now() - start;
    expect(result).toEqual({ success: true });
    expect(elapsed).toBeGreaterThanOrEqual(900);
  }, 5000);

  it('submitSession returns processing status', async () => {
    const result = await submitSession('session_123');
    expect(result.status).toBe('processing');
  });

  it('getSessionStatus returns done status', async () => {
    const result = await getSessionStatus('session_123');
    expect(result.id).toBe('session_123');
    expect(result.status).toBe('done');
  });

  it('getAnalysis returns valid analysis shape with scores, metrics, wins, fixes', async () => {
    const result = await getAnalysis('session_123');
    expect(result).toHaveProperty('scores');
    expect(result).toHaveProperty('metrics');
    expect(result).toHaveProperty('wins');
    expect(result).toHaveProperty('fixes');
    expect(result).toHaveProperty('coachingText');
    expect(result).toHaveProperty('reward');
    expect(Array.isArray(result.wins)).toBe(true);
    expect(Array.isArray(result.fixes)).toBe(true);
    expect(typeof result.coachingText).toBe('string');
  });

  it('getAnalysis scores are all between 0-100', async () => {
    const { scores } = await getAnalysis('session_123');
    for (const key of ['overall', 'delivery', 'clarity', 'story'] as const) {
      expect(scores[key]).toBeGreaterThanOrEqual(0);
      expect(scores[key]).toBeLessThanOrEqual(100);
    }
  });

  it('getAnalysis metrics are reasonable numbers', async () => {
    const { metrics } = await getAnalysis('session_123');
    expect(metrics.wpm).toBeGreaterThan(0);
    expect(metrics.fillerPerMin).toBeGreaterThanOrEqual(0);
    expect(metrics.avgPauseSec).toBeGreaterThanOrEqual(0);
    expect(metrics.pitchRangeHz).toBeGreaterThan(0);
  });

  it('submitAnxietyRating returns recorded: true', async () => {
    const result = await submitAnxietyRating('session_123', 'pre', 7);
    expect(result).toEqual({ recorded: true });
  });
});
