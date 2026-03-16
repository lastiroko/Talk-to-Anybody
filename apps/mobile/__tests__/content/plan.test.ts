import planData from '../../src/content/plan.v1.json';

const VALID_EXERCISE_TYPES = [
  'record',
  'drill',
  'reflection',
  'game',
  'unlearning_drill',
  'imitation_drill',
  'quiz',
];

describe('plan.v1.json', () => {
  it('has exactly 60 days', () => {
    expect(planData).toHaveLength(60);
  });

  it('day numbers are sequential 1-60', () => {
    const dayNumbers = planData.map((d: any) => d.dayNumber);
    const expected = Array.from({ length: 60 }, (_, i) => i + 1);
    expect(dayNumbers).toEqual(expected);
  });

  it('every day has required fields: dayNumber, title, objective, estimatedMinutes, lessonText, exercises', () => {
    for (const day of planData) {
      expect(day).toHaveProperty('dayNumber');
      expect(day).toHaveProperty('title');
      expect(day).toHaveProperty('objective');
      expect(day).toHaveProperty('estimatedMinutes');
      expect(day).toHaveProperty('lessonText');
      expect(day).toHaveProperty('exercises');
    }
  });

  it('no two days have the same dayNumber', () => {
    const dayNumbers = planData.map((d: any) => d.dayNumber);
    const unique = new Set(dayNumbers);
    expect(unique.size).toBe(dayNumbers.length);
  });

  it('every exercise has required fields: id, type, prompt, durationSec, targetMetrics', () => {
    for (const day of planData) {
      for (const exercise of (day as any).exercises) {
        expect(exercise).toHaveProperty('id');
        expect(exercise).toHaveProperty('type');
        expect(exercise).toHaveProperty('prompt');
        expect(exercise).toHaveProperty('durationSec');
        expect(exercise).toHaveProperty('targetMetrics');
      }
    }
  });

  it('exercise IDs are unique across entire plan', () => {
    const ids: string[] = [];
    for (const day of planData) {
      for (const exercise of (day as any).exercises) {
        ids.push(exercise.id);
      }
    }
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('exercise types are valid: record, drill, reflection, game, unlearning_drill, imitation_drill, quiz', () => {
    for (const day of planData) {
      for (const exercise of (day as any).exercises) {
        expect(VALID_EXERCISE_TYPES).toContain(exercise.type);
      }
    }
  });
});
