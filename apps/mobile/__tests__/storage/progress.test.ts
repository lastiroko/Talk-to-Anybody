import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loadProgress,
  saveProgress,
  markDayCompleted,
  markDayStarted,
} from '../../src/storage/progress';
import { ProgressState } from '../../src/types/progress';

const defaults: ProgressState = {
  completedDays: [],
  currentDayUnlocked: 1,
  currentStreak: 0,
  lastPracticeDate: null,
};

function toDateIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toDateIso(d);
}

function twoDaysAgo(): string {
  const d = new Date();
  d.setDate(d.getDate() - 2);
  return toDateIso(d);
}

describe('progress storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('loadProgress returns defaults when no data stored', async () => {
    const result = await loadProgress();
    expect(result).toEqual(defaults);
  });

  it('saveProgress writes to AsyncStorage', async () => {
    const state: ProgressState = {
      completedDays: [1, 2],
      currentDayUnlocked: 3,
      currentStreak: 2,
      lastPracticeDate: '2025-01-01',
    };
    await saveProgress(state);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'speakcoach_progress_v1',
      JSON.stringify(state),
    );
  });

  it('loadProgress reads what saveProgress wrote', async () => {
    const state: ProgressState = {
      completedDays: [1, 3, 5],
      currentDayUnlocked: 6,
      currentStreak: 3,
      lastPracticeDate: '2025-06-15',
    };
    await saveProgress(state);
    const loaded = await loadProgress();
    expect(loaded).toEqual(state);
  });

  it('markDayCompleted adds day to completedDays', async () => {
    const result = await markDayCompleted(defaults, 1);
    expect(result.completedDays).toContain(1);
  });

  it('markDayCompleted sorts completedDays array', async () => {
    const state: ProgressState = {
      ...defaults,
      completedDays: [3, 1],
      currentDayUnlocked: 4,
      lastPracticeDate: toDateIso(new Date()),
      currentStreak: 1,
    };
    const result = await markDayCompleted(state, 2);
    expect(result.completedDays).toEqual([1, 2, 3]);
  });

  it('markDayCompleted does not duplicate already-completed day', async () => {
    const state: ProgressState = {
      ...defaults,
      completedDays: [1],
      currentDayUnlocked: 2,
      lastPracticeDate: toDateIso(new Date()),
      currentStreak: 1,
    };
    const result = await markDayCompleted(state, 1);
    expect(result.completedDays).toEqual([1]);
  });

  it('markDayCompleted calculates streak correctly for consecutive days', async () => {
    const state: ProgressState = {
      completedDays: [1],
      currentDayUnlocked: 2,
      currentStreak: 1,
      lastPracticeDate: yesterday(),
    };
    const result = await markDayCompleted(state, 2);
    expect(result.currentStreak).toBe(2);
  });

  it('markDayCompleted resets streak after gap', async () => {
    const state: ProgressState = {
      completedDays: [1],
      currentDayUnlocked: 2,
      currentStreak: 5,
      lastPracticeDate: twoDaysAgo(),
    };
    const result = await markDayCompleted(state, 2);
    expect(result.currentStreak).toBe(1);
  });

  it('markDayStarted updates lastPracticeDate to today', async () => {
    const result = await markDayStarted(defaults);
    expect(result.lastPracticeDate).toBe(toDateIso(new Date()));
  });

  it('handles AsyncStorage failure gracefully (returns defaults)', async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
      new Error('storage error'),
    );
    const result = await loadProgress();
    expect(result).toEqual(defaults);
  });
});
