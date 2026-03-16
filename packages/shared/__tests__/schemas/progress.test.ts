import {
  ProgressStateSchema,
  AnxietyRatingRequestSchema,
  AnxietyRatingResponseSchema,
} from '../../src/schemas/progress';

const validProgress = {
  completedDays: [1, 2, 3],
  currentDayUnlocked: 4,
  currentStreak: 3,
  lastPracticeDate: '2025-01-03',
};

const validAnxietyRequest = {
  timing: 'pre' as const,
  rating: 5,
};

const validAnxietyResponse = {
  sessionId: 'sess1',
  timing: 'post' as const,
  rating: 3,
  rollingAvgPre: 4.5,
  spikeDetected: false,
  showCalmingExercise: false,
};

describe('ProgressStateSchema', () => {
  it('accepts valid data', () => {
    expect(ProgressStateSchema.safeParse(validProgress).success).toBe(true);
  });

  it('accepts lastPracticeDate as null', () => {
    expect(ProgressStateSchema.safeParse({ ...validProgress, lastPracticeDate: null }).success).toBe(true);
  });

  it('accepts empty completedDays', () => {
    expect(
      ProgressStateSchema.safeParse({ ...validProgress, completedDays: [] }).success,
    ).toBe(true);
  });

  it('rejects missing required fields', () => {
    const { completedDays, ...no } = validProgress;
    expect(ProgressStateSchema.safeParse(no).success).toBe(false);

    const { currentDayUnlocked, ...no2 } = validProgress;
    expect(ProgressStateSchema.safeParse(no2).success).toBe(false);

    const { currentStreak, ...no3 } = validProgress;
    expect(ProgressStateSchema.safeParse(no3).success).toBe(false);
  });

  it('rejects completedDays values out of 1-60 range', () => {
    expect(ProgressStateSchema.safeParse({ ...validProgress, completedDays: [0] }).success).toBe(false);
    expect(ProgressStateSchema.safeParse({ ...validProgress, completedDays: [61] }).success).toBe(false);
  });

  it('accepts completedDays boundary values', () => {
    expect(ProgressStateSchema.safeParse({ ...validProgress, completedDays: [1] }).success).toBe(true);
    expect(ProgressStateSchema.safeParse({ ...validProgress, completedDays: [60] }).success).toBe(true);
  });

  it('rejects currentDayUnlocked out of 1-60 range', () => {
    expect(ProgressStateSchema.safeParse({ ...validProgress, currentDayUnlocked: 0 }).success).toBe(false);
    expect(ProgressStateSchema.safeParse({ ...validProgress, currentDayUnlocked: 61 }).success).toBe(false);
  });

  it('accepts currentDayUnlocked boundary values', () => {
    expect(ProgressStateSchema.safeParse({ ...validProgress, currentDayUnlocked: 1 }).success).toBe(true);
    expect(ProgressStateSchema.safeParse({ ...validProgress, currentDayUnlocked: 60 }).success).toBe(true);
  });

  it('rejects negative currentStreak', () => {
    expect(ProgressStateSchema.safeParse({ ...validProgress, currentStreak: -1 }).success).toBe(false);
  });

  it('accepts currentStreak of 0', () => {
    expect(ProgressStateSchema.safeParse({ ...validProgress, currentStreak: 0 }).success).toBe(true);
  });

  it('rejects non-integer completedDays', () => {
    expect(ProgressStateSchema.safeParse({ ...validProgress, completedDays: [1.5] }).success).toBe(false);
  });

  it('rejects invalid types', () => {
    expect(ProgressStateSchema.safeParse({ ...validProgress, completedDays: 'not-array' }).success).toBe(false);
    expect(ProgressStateSchema.safeParse({ ...validProgress, currentStreak: '3' }).success).toBe(false);
  });
});

describe('AnxietyRatingRequestSchema', () => {
  it('accepts valid data', () => {
    expect(AnxietyRatingRequestSchema.safeParse(validAnxietyRequest).success).toBe(true);
  });

  it('accepts timing pre and post', () => {
    expect(AnxietyRatingRequestSchema.safeParse({ timing: 'pre', rating: 1 }).success).toBe(true);
    expect(AnxietyRatingRequestSchema.safeParse({ timing: 'post', rating: 10 }).success).toBe(true);
  });

  it('rejects rating out of 1-10 range', () => {
    expect(AnxietyRatingRequestSchema.safeParse({ timing: 'pre', rating: 0 }).success).toBe(false);
    expect(AnxietyRatingRequestSchema.safeParse({ timing: 'pre', rating: 11 }).success).toBe(false);
  });

  it('accepts rating at boundaries', () => {
    expect(AnxietyRatingRequestSchema.safeParse({ timing: 'pre', rating: 1 }).success).toBe(true);
    expect(AnxietyRatingRequestSchema.safeParse({ timing: 'pre', rating: 10 }).success).toBe(true);
  });

  it('rejects invalid timing', () => {
    expect(AnxietyRatingRequestSchema.safeParse({ timing: 'during', rating: 5 }).success).toBe(false);
  });

  it('rejects missing required fields', () => {
    expect(AnxietyRatingRequestSchema.safeParse({ timing: 'pre' }).success).toBe(false);
    expect(AnxietyRatingRequestSchema.safeParse({ rating: 5 }).success).toBe(false);
  });

  it('rejects non-integer rating', () => {
    expect(AnxietyRatingRequestSchema.safeParse({ timing: 'pre', rating: 5.5 }).success).toBe(false);
  });
});

describe('AnxietyRatingResponseSchema', () => {
  it('accepts valid data', () => {
    expect(AnxietyRatingResponseSchema.safeParse(validAnxietyResponse).success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const { sessionId, ...noSession } = validAnxietyResponse;
    expect(AnxietyRatingResponseSchema.safeParse(noSession).success).toBe(false);

    const { spikeDetected, ...noSpike } = validAnxietyResponse;
    expect(AnxietyRatingResponseSchema.safeParse(noSpike).success).toBe(false);
  });

  it('rejects invalid types', () => {
    expect(AnxietyRatingResponseSchema.safeParse({ ...validAnxietyResponse, spikeDetected: 'yes' }).success).toBe(
      false,
    );
  });

  it('rejects rating out of range', () => {
    expect(AnxietyRatingResponseSchema.safeParse({ ...validAnxietyResponse, rating: 0 }).success).toBe(false);
    expect(AnxietyRatingResponseSchema.safeParse({ ...validAnxietyResponse, rating: 11 }).success).toBe(false);
  });
});
