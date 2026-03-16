import {
  SessionSchema,
  CreateSessionRequestSchema,
  RecordingSchema,
} from '../../src/schemas/session';

const validSession = {
  id: 'sess1',
  userId: 'user1',
  mode: 'daily' as const,
  status: 'queued' as const,
  createdAt: '2025-01-01T00:00:00Z',
};

const validRecording = {
  id: 'rec1',
  sessionId: 'sess1',
  audioUrl: 'https://example.com/audio.m4a',
  audioDurationSec: 45.5,
  audioFormat: 'm4a',
  createdAt: '2025-01-01T00:00:00Z',
};

describe('SessionSchema', () => {
  it('accepts valid data', () => {
    expect(SessionSchema.safeParse(validSession).success).toBe(true);
  });

  it('accepts valid data with optional fields', () => {
    const full = { ...validSession, planDayId: 'day1', durationSec: 120 };
    expect(SessionSchema.safeParse(full).success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const { id, ...noId } = validSession;
    expect(SessionSchema.safeParse(noId).success).toBe(false);

    const { userId, ...noUser } = validSession;
    expect(SessionSchema.safeParse(noUser).success).toBe(false);

    const { mode, ...noMode } = validSession;
    expect(SessionSchema.safeParse(noMode).success).toBe(false);

    const { status, ...noStatus } = validSession;
    expect(SessionSchema.safeParse(noStatus).success).toBe(false);

    const { createdAt, ...noCreated } = validSession;
    expect(SessionSchema.safeParse(noCreated).success).toBe(false);
  });

  it('rejects invalid types', () => {
    expect(SessionSchema.safeParse({ ...validSession, id: 123 }).success).toBe(false);
  });

  it('rejects invalid mode', () => {
    expect(SessionSchema.safeParse({ ...validSession, mode: 'invalid' }).success).toBe(false);
  });

  it('rejects invalid status', () => {
    expect(SessionSchema.safeParse({ ...validSession, status: 'cancelled' }).success).toBe(false);
  });

  it('accepts all valid modes', () => {
    for (const mode of ['daily', 'freestyle', 'script', 'impromptu', 'roleplay', 'game']) {
      expect(SessionSchema.safeParse({ ...validSession, mode }).success).toBe(true);
    }
  });

  it('accepts all valid statuses', () => {
    for (const status of ['queued', 'processing', 'done', 'error']) {
      expect(SessionSchema.safeParse({ ...validSession, status }).success).toBe(true);
    }
  });

  it('rejects invalid datetime format', () => {
    expect(SessionSchema.safeParse({ ...validSession, createdAt: 'not-a-date' }).success).toBe(false);
  });

  it('allows optional fields to be undefined', () => {
    const result = SessionSchema.safeParse(validSession);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.planDayId).toBeUndefined();
      expect(result.data.durationSec).toBeUndefined();
    }
  });
});

describe('CreateSessionRequestSchema', () => {
  it('accepts valid data', () => {
    expect(CreateSessionRequestSchema.safeParse({ mode: 'freestyle' }).success).toBe(true);
  });

  it('accepts with optional planDayId', () => {
    expect(CreateSessionRequestSchema.safeParse({ mode: 'daily', planDayId: 'd1' }).success).toBe(true);
  });

  it('rejects missing mode', () => {
    expect(CreateSessionRequestSchema.safeParse({}).success).toBe(false);
  });

  it('rejects invalid mode', () => {
    expect(CreateSessionRequestSchema.safeParse({ mode: 'bad' }).success).toBe(false);
  });
});

describe('RecordingSchema', () => {
  it('accepts valid data', () => {
    expect(RecordingSchema.safeParse(validRecording).success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const { id, ...noId } = validRecording;
    expect(RecordingSchema.safeParse(noId).success).toBe(false);

    const { audioUrl, ...noUrl } = validRecording;
    expect(RecordingSchema.safeParse(noUrl).success).toBe(false);
  });

  it('rejects invalid audioUrl', () => {
    expect(RecordingSchema.safeParse({ ...validRecording, audioUrl: 'not-url' }).success).toBe(false);
  });

  it('rejects negative audioDurationSec', () => {
    expect(RecordingSchema.safeParse({ ...validRecording, audioDurationSec: -1 }).success).toBe(false);
  });

  it('accepts audioDurationSec of 0', () => {
    expect(RecordingSchema.safeParse({ ...validRecording, audioDurationSec: 0 }).success).toBe(true);
  });

  it('rejects invalid types', () => {
    expect(RecordingSchema.safeParse({ ...validRecording, audioFormat: 123 }).success).toBe(false);
  });

  it('rejects invalid datetime', () => {
    expect(RecordingSchema.safeParse({ ...validRecording, createdAt: 'nope' }).success).toBe(false);
  });
});
