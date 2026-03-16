import {
  PlanDaySchema,
  PlanExerciseSchema,
  AnxietyGateSchema,
  LessonSchema,
  UnlearningConfigSchema,
  ImitationConfigSchema,
} from '../../src/schemas/plan';

const validExercise = {
  id: 'ex1',
  type: 'record' as const,
  prompt: 'test',
  durationSec: 60,
  targetMetrics: ['wpm'],
};

const validDay = {
  dayNumber: 1,
  title: 'T',
  objective: 'O',
  estimatedMinutes: 5,
  lessonText: 'L',
  exercises: [validExercise],
};

describe('PlanExerciseSchema', () => {
  it('accepts valid data', () => {
    expect(PlanExerciseSchema.safeParse(validExercise).success).toBe(true);
  });

  it('accepts valid data with all optional fields', () => {
    const full = {
      ...validExercise,
      instructions: 'do this',
      maxDurationSec: 120,
      srsDimensions: ['fillers', 'pace'],
      reviewPriority: 0.7,
      unlearning: { habitType: 'filler', phase: 'detect', detectionThreshold: 0.8 },
      imitation: {
        expertClipId: 'clip1',
        techniqueType: 'pause',
        comparisonDimensions: ['waveform', 'pitch'],
      },
    };
    expect(PlanExerciseSchema.safeParse(full).success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const { id, ...noId } = validExercise;
    expect(PlanExerciseSchema.safeParse(noId).success).toBe(false);

    const { type, ...noType } = validExercise;
    expect(PlanExerciseSchema.safeParse(noType).success).toBe(false);

    const { prompt, ...noPrompt } = validExercise;
    expect(PlanExerciseSchema.safeParse(noPrompt).success).toBe(false);
  });

  it('rejects invalid types', () => {
    expect(PlanExerciseSchema.safeParse({ ...validExercise, id: 123 }).success).toBe(false);
    expect(PlanExerciseSchema.safeParse({ ...validExercise, type: 'invalid' }).success).toBe(false);
    expect(PlanExerciseSchema.safeParse({ ...validExercise, durationSec: 'abc' }).success).toBe(false);
  });

  it('rejects non-positive durationSec', () => {
    expect(PlanExerciseSchema.safeParse({ ...validExercise, durationSec: 0 }).success).toBe(false);
    expect(PlanExerciseSchema.safeParse({ ...validExercise, durationSec: -1 }).success).toBe(false);
  });

  it('rejects reviewPriority out of 0-1 range', () => {
    expect(PlanExerciseSchema.safeParse({ ...validExercise, reviewPriority: -0.1 }).success).toBe(false);
    expect(PlanExerciseSchema.safeParse({ ...validExercise, reviewPriority: 1.1 }).success).toBe(false);
  });

  it('accepts reviewPriority at boundaries', () => {
    expect(PlanExerciseSchema.safeParse({ ...validExercise, reviewPriority: 0 }).success).toBe(true);
    expect(PlanExerciseSchema.safeParse({ ...validExercise, reviewPriority: 1 }).success).toBe(true);
  });

  it('allows optional fields to be undefined', () => {
    const result = PlanExerciseSchema.safeParse(validExercise);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.instructions).toBeUndefined();
      expect(result.data.maxDurationSec).toBeUndefined();
      expect(result.data.srsDimensions).toBeUndefined();
    }
  });
});

describe('PlanDaySchema', () => {
  it('accepts valid data', () => {
    expect(PlanDaySchema.safeParse(validDay).success).toBe(true);
  });

  it('accepts valid data with optional fields', () => {
    const full = {
      ...validDay,
      durationTargetSec: 120,
      games: ['g1'],
      anxietyGate: { minLevel: 1, showPreRating: true, showPostRating: false },
      rewardEligibleFormats: ['full_scorecard', 'golden_insight'],
    };
    expect(PlanDaySchema.safeParse(full).success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const { title, ...noTitle } = validDay;
    expect(PlanDaySchema.safeParse(noTitle).success).toBe(false);

    const { exercises, ...noExercises } = validDay;
    expect(PlanDaySchema.safeParse(noExercises).success).toBe(false);
  });

  it('rejects invalid types', () => {
    expect(PlanDaySchema.safeParse({ ...validDay, dayNumber: 'one' }).success).toBe(false);
    expect(PlanDaySchema.safeParse({ ...validDay, exercises: 'not-array' }).success).toBe(false);
  });

  it('rejects dayNumber out of range', () => {
    expect(PlanDaySchema.safeParse({ ...validDay, dayNumber: 0 }).success).toBe(false);
    expect(PlanDaySchema.safeParse({ ...validDay, dayNumber: 61 }).success).toBe(false);
    expect(PlanDaySchema.safeParse({ ...validDay, dayNumber: -1 }).success).toBe(false);
  });

  it('accepts dayNumber at boundaries', () => {
    expect(PlanDaySchema.safeParse({ ...validDay, dayNumber: 1 }).success).toBe(true);
    expect(PlanDaySchema.safeParse({ ...validDay, dayNumber: 60 }).success).toBe(true);
  });

  it('rejects non-positive estimatedMinutes', () => {
    expect(PlanDaySchema.safeParse({ ...validDay, estimatedMinutes: 0 }).success).toBe(false);
  });
});

describe('AnxietyGateSchema', () => {
  const valid = { minLevel: 3, showPreRating: true, showPostRating: false };

  it('accepts valid data', () => {
    expect(AnxietyGateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const { minLevel, ...noMinLevel } = valid;
    expect(AnxietyGateSchema.safeParse(noMinLevel).success).toBe(false);
  });

  it('rejects minLevel out of 1-6 range', () => {
    expect(AnxietyGateSchema.safeParse({ ...valid, minLevel: 0 }).success).toBe(false);
    expect(AnxietyGateSchema.safeParse({ ...valid, minLevel: 7 }).success).toBe(false);
  });

  it('accepts minLevel at boundaries', () => {
    expect(AnxietyGateSchema.safeParse({ ...valid, minLevel: 1 }).success).toBe(true);
    expect(AnxietyGateSchema.safeParse({ ...valid, minLevel: 6 }).success).toBe(true);
  });

  it('rejects invalid types', () => {
    expect(AnxietyGateSchema.safeParse({ ...valid, showPreRating: 'yes' }).success).toBe(false);
  });
});

describe('LessonSchema', () => {
  const valid = { type: 'text', content: 'lesson content', assetUrl: null };

  it('accepts valid data', () => {
    expect(LessonSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts valid URL for assetUrl', () => {
    expect(LessonSchema.safeParse({ ...valid, assetUrl: 'https://example.com/a.mp3' }).success).toBe(true);
  });

  it('rejects invalid assetUrl', () => {
    expect(LessonSchema.safeParse({ ...valid, assetUrl: 'not-a-url' }).success).toBe(false);
  });

  it('rejects missing required fields', () => {
    expect(LessonSchema.safeParse({ type: 'text', content: 'c' }).success).toBe(false);
  });

  it('rejects invalid lesson type', () => {
    expect(LessonSchema.safeParse({ ...valid, type: 'podcast' }).success).toBe(false);
  });
});

describe('UnlearningConfigSchema', () => {
  const valid = { habitType: 'filler', phase: 'detect', detectionThreshold: 0.8 };

  it('accepts valid data', () => {
    expect(UnlearningConfigSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const { habitType, ...noHabit } = valid;
    expect(UnlearningConfigSchema.safeParse(noHabit).success).toBe(false);
  });

  it('rejects invalid habitType', () => {
    expect(UnlearningConfigSchema.safeParse({ ...valid, habitType: 'mumbling' }).success).toBe(false);
  });

  it('rejects invalid phase', () => {
    expect(UnlearningConfigSchema.safeParse({ ...valid, phase: 'unknown' }).success).toBe(false);
  });
});

describe('ImitationConfigSchema', () => {
  const valid = {
    expertClipId: 'clip1',
    techniqueType: 'pause',
    comparisonDimensions: ['waveform'],
  };

  it('accepts valid data', () => {
    expect(ImitationConfigSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const { expertClipId, ...noClip } = valid;
    expect(ImitationConfigSchema.safeParse(noClip).success).toBe(false);
  });

  it('rejects invalid techniqueType', () => {
    expect(ImitationConfigSchema.safeParse({ ...valid, techniqueType: 'shout' }).success).toBe(false);
  });

  it('rejects invalid comparisonDimensions', () => {
    expect(ImitationConfigSchema.safeParse({ ...valid, comparisonDimensions: ['invalid'] }).success).toBe(false);
  });
});
