import {
  ScoresSchema,
  MetricsSchema,
  CoachingFixSchema,
  AnalysisResultSchema,
  RewardSchema,
} from '../../src/schemas/analysis';

const validScores = { overall: 75, delivery: 80, clarity: 90, story: 60 };
const validMetrics = { wpm: 140, fillerPerMin: 3.2, avgPauseSec: 0.8, pitchRangeHz: 50 };
const validFix = { title: 'Slow down', drillId: 'drill1' };

describe('ScoresSchema', () => {
  it('accepts valid data', () => {
    expect(ScoresSchema.safeParse(validScores).success).toBe(true);
  });

  it('accepts boundary values 0 and 100', () => {
    const low = { overall: 0, delivery: 0, clarity: 0, story: 0 };
    const high = { overall: 100, delivery: 100, clarity: 100, story: 100 };
    expect(ScoresSchema.safeParse(low).success).toBe(true);
    expect(ScoresSchema.safeParse(high).success).toBe(true);
  });

  it('rejects scores below 0', () => {
    expect(ScoresSchema.safeParse({ ...validScores, overall: -1 }).success).toBe(false);
    expect(ScoresSchema.safeParse({ ...validScores, delivery: -0.1 }).success).toBe(false);
  });

  it('rejects scores above 100', () => {
    expect(ScoresSchema.safeParse({ ...validScores, clarity: 101 }).success).toBe(false);
    expect(ScoresSchema.safeParse({ ...validScores, story: 100.1 }).success).toBe(false);
  });

  it('rejects missing required fields', () => {
    const { overall, ...noOverall } = validScores;
    expect(ScoresSchema.safeParse(noOverall).success).toBe(false);

    const { delivery, ...noDelivery } = validScores;
    expect(ScoresSchema.safeParse(noDelivery).success).toBe(false);
  });

  it('rejects invalid types', () => {
    expect(ScoresSchema.safeParse({ ...validScores, overall: 'high' }).success).toBe(false);
  });
});

describe('MetricsSchema', () => {
  it('accepts valid data', () => {
    expect(MetricsSchema.safeParse(validMetrics).success).toBe(true);
  });

  it('accepts zero values', () => {
    const zeros = { wpm: 0, fillerPerMin: 0, avgPauseSec: 0, pitchRangeHz: 0 };
    expect(MetricsSchema.safeParse(zeros).success).toBe(true);
  });

  it('accepts with optional vocalVariety', () => {
    expect(MetricsSchema.safeParse({ ...validMetrics, vocalVariety: 50 }).success).toBe(true);
  });

  it('rejects negative values', () => {
    expect(MetricsSchema.safeParse({ ...validMetrics, wpm: -1 }).success).toBe(false);
    expect(MetricsSchema.safeParse({ ...validMetrics, fillerPerMin: -0.1 }).success).toBe(false);
    expect(MetricsSchema.safeParse({ ...validMetrics, avgPauseSec: -1 }).success).toBe(false);
    expect(MetricsSchema.safeParse({ ...validMetrics, pitchRangeHz: -1 }).success).toBe(false);
  });

  it('rejects vocalVariety out of 0-100', () => {
    expect(MetricsSchema.safeParse({ ...validMetrics, vocalVariety: -1 }).success).toBe(false);
    expect(MetricsSchema.safeParse({ ...validMetrics, vocalVariety: 101 }).success).toBe(false);
  });

  it('rejects missing required fields', () => {
    const { wpm, ...noWpm } = validMetrics;
    expect(MetricsSchema.safeParse(noWpm).success).toBe(false);
  });

  it('rejects invalid types', () => {
    expect(MetricsSchema.safeParse({ ...validMetrics, wpm: 'fast' }).success).toBe(false);
  });
});

describe('CoachingFixSchema', () => {
  it('accepts valid data', () => {
    expect(CoachingFixSchema.safeParse(validFix).success).toBe(true);
  });

  it('rejects missing required fields', () => {
    expect(CoachingFixSchema.safeParse({ title: 'x' }).success).toBe(false);
    expect(CoachingFixSchema.safeParse({ drillId: 'x' }).success).toBe(false);
  });

  it('rejects invalid types', () => {
    expect(CoachingFixSchema.safeParse({ title: 123, drillId: 'x' }).success).toBe(false);
  });
});

describe('RewardSchema', () => {
  it('accepts full_scorecard with null content', () => {
    expect(RewardSchema.safeParse({ format: 'full_scorecard', content: null }).success).toBe(true);
  });

  it('accepts golden_insight with valid content', () => {
    const reward = {
      format: 'golden_insight',
      content: { title: 't', body: 'b', ctaLabel: 'c' },
    };
    expect(RewardSchema.safeParse(reward).success).toBe(true);
  });

  it('rejects invalid format', () => {
    expect(RewardSchema.safeParse({ format: 'bad', content: null }).success).toBe(false);
  });

  it('rejects missing required fields', () => {
    expect(RewardSchema.safeParse({ format: 'full_scorecard' }).success).toBe(false);
  });
});

describe('AnalysisResultSchema', () => {
  const validResult = {
    scores: validScores,
    metrics: validMetrics,
    wins: ['good pace'],
    fixes: [validFix],
    tags: ['beginner'],
    coachingText: 'Keep it up!',
  };

  it('accepts valid data', () => {
    expect(AnalysisResultSchema.safeParse(validResult).success).toBe(true);
  });

  it('accepts with optional reward', () => {
    const withReward = {
      ...validResult,
      reward: { format: 'full_scorecard', content: null },
    };
    expect(AnalysisResultSchema.safeParse(withReward).success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const { scores, ...noScores } = validResult;
    expect(AnalysisResultSchema.safeParse(noScores).success).toBe(false);

    const { coachingText, ...noCoaching } = validResult;
    expect(AnalysisResultSchema.safeParse(noCoaching).success).toBe(false);
  });

  it('rejects invalid nested schemas', () => {
    expect(
      AnalysisResultSchema.safeParse({ ...validResult, scores: { overall: -1, delivery: 0, clarity: 0, story: 0 } })
        .success,
    ).toBe(false);
  });

  it('rejects invalid types for arrays', () => {
    expect(AnalysisResultSchema.safeParse({ ...validResult, wins: 'not-array' }).success).toBe(false);
    expect(AnalysisResultSchema.safeParse({ ...validResult, tags: 123 }).success).toBe(false);
  });

  it('allows optional reward to be undefined', () => {
    const result = AnalysisResultSchema.safeParse(validResult);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.reward).toBeUndefined();
    }
  });
});
