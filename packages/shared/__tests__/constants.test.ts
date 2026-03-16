import {
  MAX_DAY,
  MAX_RECORDING_SEC,
  MICRO_COMMITMENT_CURVE,
  DESENSITIZATION_LEVEL_LABELS,
} from '../src/constants';

describe('constants', () => {
  it('MAX_DAY equals 60', () => {
    expect(MAX_DAY).toBe(60);
  });

  it('MAX_RECORDING_SEC equals 300', () => {
    expect(MAX_RECORDING_SEC).toBe(300);
  });

  it('MICRO_COMMITMENT_CURVE has correct day ranges', () => {
    expect(MICRO_COMMITMENT_CURVE).toHaveProperty('1-5');
    expect(MICRO_COMMITMENT_CURVE).toHaveProperty('6-15');
    expect(MICRO_COMMITMENT_CURVE).toHaveProperty('16-30');
    expect(MICRO_COMMITMENT_CURVE).toHaveProperty('31-60');
    expect(Object.keys(MICRO_COMMITMENT_CURVE)).toHaveLength(4);

    // Each range is a [min, max] tuple with increasing durations
    expect(MICRO_COMMITMENT_CURVE['1-5']).toEqual([90, 120]);
    expect(MICRO_COMMITMENT_CURVE['6-15']).toEqual([180, 300]);
    expect(MICRO_COMMITMENT_CURVE['16-30']).toEqual([300, 480]);
    expect(MICRO_COMMITMENT_CURVE['31-60']).toEqual([480, 720]);
  });

  it('DESENSITIZATION_LEVEL_LABELS has 6 levels', () => {
    const keys = Object.keys(DESENSITIZATION_LEVEL_LABELS).map(Number);
    expect(keys).toHaveLength(6);
    expect(keys).toEqual([1, 2, 3, 4, 5, 6]);

    // Each label is a non-empty string
    for (const key of keys) {
      expect(typeof DESENSITIZATION_LEVEL_LABELS[key]).toBe('string');
      expect(DESENSITIZATION_LEVEL_LABELS[key].length).toBeGreaterThan(0);
    }
  });
});
