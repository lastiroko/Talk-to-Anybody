import { SrsCardSchema } from '../../src/schemas/srs';

const validCard = {
  cardId: 'card1',
  drillId: 'drill1',
  dimension: 'fillers' as const,
  currentIntervalDays: 1,
  lastScore: 75,
  reviewCount: 3,
  reviewPriority: 0.5,
  nextReviewDate: '2025-01-15',
};

describe('SrsCardSchema', () => {
  it('accepts valid data', () => {
    expect(SrsCardSchema.safeParse(validCard).success).toBe(true);
  });

  it('accepts all valid dimensions', () => {
    const dims = ['fillers', 'pauses', 'pace', 'structure', 'vocal_variety', 'clarity', 'storytelling'];
    for (const dimension of dims) {
      expect(SrsCardSchema.safeParse({ ...validCard, dimension }).success).toBe(true);
    }
  });

  it('rejects missing required fields', () => {
    const { cardId, ...noCardId } = validCard;
    expect(SrsCardSchema.safeParse(noCardId).success).toBe(false);

    const { drillId, ...noDrill } = validCard;
    expect(SrsCardSchema.safeParse(noDrill).success).toBe(false);

    const { dimension, ...noDim } = validCard;
    expect(SrsCardSchema.safeParse(noDim).success).toBe(false);

    const { nextReviewDate, ...noDate } = validCard;
    expect(SrsCardSchema.safeParse(noDate).success).toBe(false);
  });

  it('rejects invalid dimension', () => {
    expect(SrsCardSchema.safeParse({ ...validCard, dimension: 'invalid' }).success).toBe(false);
  });

  it('rejects non-positive currentIntervalDays', () => {
    expect(SrsCardSchema.safeParse({ ...validCard, currentIntervalDays: 0 }).success).toBe(false);
    expect(SrsCardSchema.safeParse({ ...validCard, currentIntervalDays: -1 }).success).toBe(false);
  });

  it('accepts currentIntervalDays of 1', () => {
    expect(SrsCardSchema.safeParse({ ...validCard, currentIntervalDays: 1 }).success).toBe(true);
  });

  it('rejects lastScore out of 0-100 range', () => {
    expect(SrsCardSchema.safeParse({ ...validCard, lastScore: -1 }).success).toBe(false);
    expect(SrsCardSchema.safeParse({ ...validCard, lastScore: 101 }).success).toBe(false);
  });

  it('accepts lastScore at boundaries', () => {
    expect(SrsCardSchema.safeParse({ ...validCard, lastScore: 0 }).success).toBe(true);
    expect(SrsCardSchema.safeParse({ ...validCard, lastScore: 100 }).success).toBe(true);
  });

  it('rejects negative reviewCount', () => {
    expect(SrsCardSchema.safeParse({ ...validCard, reviewCount: -1 }).success).toBe(false);
  });

  it('accepts reviewCount of 0', () => {
    expect(SrsCardSchema.safeParse({ ...validCard, reviewCount: 0 }).success).toBe(true);
  });

  it('rejects reviewPriority out of 0-1 range', () => {
    expect(SrsCardSchema.safeParse({ ...validCard, reviewPriority: -0.1 }).success).toBe(false);
    expect(SrsCardSchema.safeParse({ ...validCard, reviewPriority: 1.1 }).success).toBe(false);
  });

  it('accepts reviewPriority at boundaries', () => {
    expect(SrsCardSchema.safeParse({ ...validCard, reviewPriority: 0 }).success).toBe(true);
    expect(SrsCardSchema.safeParse({ ...validCard, reviewPriority: 1 }).success).toBe(true);
  });

  it('rejects non-integer currentIntervalDays', () => {
    expect(SrsCardSchema.safeParse({ ...validCard, currentIntervalDays: 1.5 }).success).toBe(false);
  });

  it('rejects non-integer reviewCount', () => {
    expect(SrsCardSchema.safeParse({ ...validCard, reviewCount: 2.5 }).success).toBe(false);
  });

  it('rejects invalid types', () => {
    expect(SrsCardSchema.safeParse({ ...validCard, cardId: 123 }).success).toBe(false);
    expect(SrsCardSchema.safeParse({ ...validCard, lastScore: 'high' }).success).toBe(false);
  });
});
