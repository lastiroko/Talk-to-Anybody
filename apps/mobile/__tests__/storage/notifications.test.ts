import {
  loadReminderPrefs,
  saveReminderPrefs,
  updateReminderPrefs,
  formatReminderTime,
} from '../../src/storage/notifications';

const AsyncStorage = require('@react-native-async-storage/async-storage');

beforeEach(() => {
  AsyncStorage.__resetStore();
});

describe('reminder prefs storage', () => {
  it('returns defaults when nothing is stored', async () => {
    const prefs = await loadReminderPrefs();
    expect(prefs.dailyReminderEnabled).toBe(false);
    expect(prefs.reminderHour).toBe(9);
    expect(prefs.reminderMinute).toBe(0);
    expect(prefs.streakRescueEnabled).toBe(false);
    expect(prefs.lastPracticeAt).toBeNull();
  });

  it('persists and reloads values', async () => {
    await saveReminderPrefs({
      dailyReminderEnabled: true,
      reminderHour: 18,
      reminderMinute: 30,
      streakRescueEnabled: true,
      lastPracticeAt: '2026-05-11T08:00:00.000Z',
    });
    const prefs = await loadReminderPrefs();
    expect(prefs.dailyReminderEnabled).toBe(true);
    expect(prefs.reminderHour).toBe(18);
    expect(prefs.reminderMinute).toBe(30);
    expect(prefs.streakRescueEnabled).toBe(true);
    expect(prefs.lastPracticeAt).toBe('2026-05-11T08:00:00.000Z');
  });

  it('merges partial updates with existing prefs', async () => {
    await saveReminderPrefs({
      dailyReminderEnabled: true,
      reminderHour: 9,
      reminderMinute: 0,
      streakRescueEnabled: false,
      lastPracticeAt: null,
    });
    const next = await updateReminderPrefs({ reminderHour: 20 });
    expect(next.reminderHour).toBe(20);
    expect(next.dailyReminderEnabled).toBe(true);
    expect(next.streakRescueEnabled).toBe(false);
  });

  it('falls back to defaults on corrupt JSON', async () => {
    await AsyncStorage.default.setItem('@speakcoach/reminderPrefs', 'not-json');
    const prefs = await loadReminderPrefs();
    expect(prefs.dailyReminderEnabled).toBe(false);
  });
});

describe('formatReminderTime', () => {
  it('formats AM times', () => {
    expect(formatReminderTime(9, 0)).toBe('9:00 AM');
    expect(formatReminderTime(0, 5)).toBe('12:05 AM');
    expect(formatReminderTime(7, 45)).toBe('7:45 AM');
  });

  it('formats PM times', () => {
    expect(formatReminderTime(13, 0)).toBe('1:00 PM');
    expect(formatReminderTime(12, 30)).toBe('12:30 PM');
    expect(formatReminderTime(20, 5)).toBe('8:05 PM');
  });
});
