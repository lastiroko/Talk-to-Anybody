import {
  ExerciseTypes,
  HabitTypes,
  SrsDimensions,
  RewardFormats,
  SessionModes,
} from '../src/enums';

describe('enums', () => {
  it('ExerciseTypes includes all 7 types', () => {
    expect(ExerciseTypes).toEqual([
      'record',
      'quiz',
      'reflection',
      'game',
      'drill',
      'unlearning_drill',
      'imitation_drill',
    ]);
    expect(ExerciseTypes).toHaveLength(7);
  });

  it('HabitTypes includes filler, uptalk, rushing', () => {
    expect(HabitTypes).toEqual(['filler', 'uptalk', 'rushing']);
    expect(HabitTypes).toHaveLength(3);
  });

  it('SrsDimensions includes all 7 dimensions', () => {
    expect(SrsDimensions).toEqual([
      'fillers',
      'pauses',
      'pace',
      'structure',
      'vocal_variety',
      'clarity',
      'storytelling',
    ]);
    expect(SrsDimensions).toHaveLength(7);
  });

  it('RewardFormats includes all 5 formats', () => {
    expect(RewardFormats).toEqual([
      'full_scorecard',
      'golden_insight',
      'surprise_challenge',
      'community_before_after',
      'streak_milestone',
    ]);
    expect(RewardFormats).toHaveLength(5);
  });

  it('SessionModes includes all 6 modes', () => {
    expect(SessionModes).toEqual([
      'daily',
      'freestyle',
      'script',
      'impromptu',
      'roleplay',
      'game',
    ]);
    expect(SessionModes).toHaveLength(6);
  });
});
