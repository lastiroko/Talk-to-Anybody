import {
  UnlearningHabitStatusSchema,
  DetectTapRequestSchema,
  DetectTapResponseSchema,
} from '../../src/schemas/unlearning';

const validHabitStatus = {
  habitType: 'filler' as const,
  currentPhase: 'detect' as const,
  phaseStartedAt: '2025-01-01T00:00:00Z',
  phasesCompleted: [] as string[],
  detectionAccuracy: 0.85,
  consecutiveCleanSessions: 0,
  detectionThreshold: 0.8,
};

const validDetectTapRequest = {
  sessionId: 'sess1',
  habitType: 'uptalk' as const,
  userTaps: [{ timestampSec: 1.5 }, { timestampSec: 3.2 }],
};

const validDetectTapResponse = {
  aiDetectedCount: 5,
  userTappedCount: 4,
  matched: 3,
  missed: 2,
  falsePositives: 1,
  accuracy: 0.6,
  threshold: 0.8,
  phasePassed: false,
  aiMarkers: [{ timestampSec: 1.5, word: 'um' }],
};

describe('UnlearningHabitStatusSchema', () => {
  it('accepts valid data', () => {
    expect(UnlearningHabitStatusSchema.safeParse(validHabitStatus).success).toBe(true);
  });

  it('accepts with completed phases', () => {
    const withPhases = { ...validHabitStatus, phasesCompleted: ['detect', 'disrupt'] };
    expect(UnlearningHabitStatusSchema.safeParse(withPhases).success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const { habitType, ...noHabit } = validHabitStatus;
    expect(UnlearningHabitStatusSchema.safeParse(noHabit).success).toBe(false);

    const { currentPhase, ...noPhase } = validHabitStatus;
    expect(UnlearningHabitStatusSchema.safeParse(noPhase).success).toBe(false);

    const { phaseStartedAt, ...noStarted } = validHabitStatus;
    expect(UnlearningHabitStatusSchema.safeParse(noStarted).success).toBe(false);
  });

  it('rejects invalid habitType', () => {
    expect(UnlearningHabitStatusSchema.safeParse({ ...validHabitStatus, habitType: 'mumbling' }).success).toBe(false);
  });

  it('rejects invalid phase', () => {
    expect(UnlearningHabitStatusSchema.safeParse({ ...validHabitStatus, currentPhase: 'unknown' }).success).toBe(false);
  });

  it('rejects detectionAccuracy out of 0-1 range', () => {
    expect(UnlearningHabitStatusSchema.safeParse({ ...validHabitStatus, detectionAccuracy: -0.1 }).success).toBe(false);
    expect(UnlearningHabitStatusSchema.safeParse({ ...validHabitStatus, detectionAccuracy: 1.1 }).success).toBe(false);
  });

  it('accepts detectionAccuracy at boundaries', () => {
    expect(UnlearningHabitStatusSchema.safeParse({ ...validHabitStatus, detectionAccuracy: 0 }).success).toBe(true);
    expect(UnlearningHabitStatusSchema.safeParse({ ...validHabitStatus, detectionAccuracy: 1 }).success).toBe(true);
  });

  it('rejects negative consecutiveCleanSessions', () => {
    expect(
      UnlearningHabitStatusSchema.safeParse({ ...validHabitStatus, consecutiveCleanSessions: -1 }).success,
    ).toBe(false);
  });

  it('rejects invalid datetime for phaseStartedAt', () => {
    expect(
      UnlearningHabitStatusSchema.safeParse({ ...validHabitStatus, phaseStartedAt: 'not-a-date' }).success,
    ).toBe(false);
  });

  it('rejects invalid types', () => {
    expect(
      UnlearningHabitStatusSchema.safeParse({ ...validHabitStatus, consecutiveCleanSessions: 'zero' }).success,
    ).toBe(false);
  });
});

describe('DetectTapRequestSchema', () => {
  it('accepts valid data', () => {
    expect(DetectTapRequestSchema.safeParse(validDetectTapRequest).success).toBe(true);
  });

  it('accepts empty userTaps', () => {
    expect(
      DetectTapRequestSchema.safeParse({ ...validDetectTapRequest, userTaps: [] }).success,
    ).toBe(true);
  });

  it('rejects missing required fields', () => {
    const { sessionId, ...noSession } = validDetectTapRequest;
    expect(DetectTapRequestSchema.safeParse(noSession).success).toBe(false);

    const { habitType, ...noHabit } = validDetectTapRequest;
    expect(DetectTapRequestSchema.safeParse(noHabit).success).toBe(false);
  });

  it('rejects invalid habitType', () => {
    expect(DetectTapRequestSchema.safeParse({ ...validDetectTapRequest, habitType: 'bad' }).success).toBe(false);
  });

  it('rejects negative tap timestamps', () => {
    expect(
      DetectTapRequestSchema.safeParse({ ...validDetectTapRequest, userTaps: [{ timestampSec: -1 }] }).success,
    ).toBe(false);
  });

  it('rejects invalid types', () => {
    expect(DetectTapRequestSchema.safeParse({ ...validDetectTapRequest, sessionId: 123 }).success).toBe(false);
  });
});

describe('DetectTapResponseSchema', () => {
  it('accepts valid data', () => {
    expect(DetectTapResponseSchema.safeParse(validDetectTapResponse).success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const { accuracy, ...noAccuracy } = validDetectTapResponse;
    expect(DetectTapResponseSchema.safeParse(noAccuracy).success).toBe(false);

    const { phasePassed, ...noPassed } = validDetectTapResponse;
    expect(DetectTapResponseSchema.safeParse(noPassed).success).toBe(false);
  });

  it('rejects accuracy out of 0-1 range', () => {
    expect(DetectTapResponseSchema.safeParse({ ...validDetectTapResponse, accuracy: -0.1 }).success).toBe(false);
    expect(DetectTapResponseSchema.safeParse({ ...validDetectTapResponse, accuracy: 1.1 }).success).toBe(false);
  });

  it('accepts accuracy at boundaries', () => {
    expect(DetectTapResponseSchema.safeParse({ ...validDetectTapResponse, accuracy: 0 }).success).toBe(true);
    expect(DetectTapResponseSchema.safeParse({ ...validDetectTapResponse, accuracy: 1 }).success).toBe(true);
  });

  it('rejects negative counts', () => {
    expect(DetectTapResponseSchema.safeParse({ ...validDetectTapResponse, aiDetectedCount: -1 }).success).toBe(false);
    expect(DetectTapResponseSchema.safeParse({ ...validDetectTapResponse, matched: -1 }).success).toBe(false);
    expect(DetectTapResponseSchema.safeParse({ ...validDetectTapResponse, missed: -1 }).success).toBe(false);
    expect(DetectTapResponseSchema.safeParse({ ...validDetectTapResponse, falsePositives: -1 }).success).toBe(false);
  });

  it('rejects invalid types', () => {
    expect(DetectTapResponseSchema.safeParse({ ...validDetectTapResponse, phasePassed: 'no' }).success).toBe(false);
  });
});
