import {
  scheduleDailyReminder,
  scheduleStreakRescue,
  cancelDailyReminder,
  cancelStreakRescue,
  applyReminderPrefs,
  setDailyReminder,
  setStreakRescue,
  setReminderTime,
  onPracticeCompleted,
  initNotifications,
  getPermissionStatus,
} from '../../src/services/notifications';
import { loadReminderPrefs, saveReminderPrefs } from '../../src/storage/notifications';

const Notifications = require('expo-notifications');
const AsyncStorage = require('@react-native-async-storage/async-storage');

beforeEach(() => {
  AsyncStorage.__resetStore();
  jest.clearAllMocks();
  Notifications.getPermissionsAsync.mockResolvedValue({ granted: true, canAskAgain: true });
  Notifications.requestPermissionsAsync.mockResolvedValue({ granted: true });
});

describe('scheduleDailyReminder', () => {
  it('cancels existing reminder and schedules a fresh one', async () => {
    const ok = await scheduleDailyReminder(9, 0);
    expect(ok).toBe(true);
    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith('speakcoach-daily-reminder');
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        identifier: 'speakcoach-daily-reminder',
        trigger: expect.objectContaining({ hour: 9, minute: 0, repeats: true }),
      }),
    );
  });

  it('returns false when permission is denied', async () => {
    Notifications.getPermissionsAsync.mockResolvedValue({ granted: false, canAskAgain: true });
    const ok = await scheduleDailyReminder(9, 0);
    expect(ok).toBe(false);
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });
});

describe('scheduleStreakRescue', () => {
  it('schedules a one-shot 20h reminder by default', async () => {
    const ok = await scheduleStreakRescue();
    expect(ok).toBe(true);
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        identifier: 'speakcoach-streak-rescue',
        trigger: expect.objectContaining({ seconds: 72000, repeats: false }),
      }),
    );
  });

  it('clamps very small delays to 60s', async () => {
    await scheduleStreakRescue(0);
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        trigger: expect.objectContaining({ seconds: 60 }),
      }),
    );
  });
});

describe('cancel helpers', () => {
  it('cancelDailyReminder calls the correct identifier', async () => {
    await cancelDailyReminder();
    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith('speakcoach-daily-reminder');
  });

  it('cancelStreakRescue calls the correct identifier', async () => {
    await cancelStreakRescue();
    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith('speakcoach-streak-rescue');
  });
});

describe('applyReminderPrefs', () => {
  it('schedules daily reminder when enabled', async () => {
    const result = await applyReminderPrefs({
      dailyReminderEnabled: true,
      reminderHour: 8,
      reminderMinute: 15,
      streakRescueEnabled: false,
      lastPracticeAt: null,
    });
    expect(result.dailyReminderEnabled).toBe(true);
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
  });

  it('cancels daily reminder when disabled', async () => {
    await applyReminderPrefs({
      dailyReminderEnabled: false,
      reminderHour: 8,
      reminderMinute: 15,
      streakRescueEnabled: false,
      lastPracticeAt: null,
    });
    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith('speakcoach-daily-reminder');
  });

  it('flips dailyReminderEnabled back to false if scheduling fails', async () => {
    Notifications.getPermissionsAsync.mockResolvedValue({ granted: false, canAskAgain: true });
    const result = await applyReminderPrefs({
      dailyReminderEnabled: true,
      reminderHour: 8,
      reminderMinute: 15,
      streakRescueEnabled: false,
      lastPracticeAt: null,
    });
    expect(result.dailyReminderEnabled).toBe(false);
    const stored = await loadReminderPrefs();
    expect(stored.dailyReminderEnabled).toBe(false);
  });
});

describe('setDailyReminder', () => {
  it('enables and schedules when permission granted', async () => {
    const prefs = await setDailyReminder(true, 10, 30);
    expect(prefs.dailyReminderEnabled).toBe(true);
    expect(prefs.reminderHour).toBe(10);
    expect(prefs.reminderMinute).toBe(30);
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
  });

  it('rolls back when permission denied', async () => {
    Notifications.requestPermissionsAsync.mockResolvedValue({ granted: false });
    Notifications.getPermissionsAsync.mockResolvedValue({ granted: false, canAskAgain: false });
    const prefs = await setDailyReminder(true, 10, 30);
    expect(prefs.dailyReminderEnabled).toBe(false);
  });

  it('disables and cancels', async () => {
    await setDailyReminder(true, 9, 0);
    jest.clearAllMocks();
    const prefs = await setDailyReminder(false);
    expect(prefs.dailyReminderEnabled).toBe(false);
    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith('speakcoach-daily-reminder');
  });
});

describe('setStreakRescue', () => {
  it('enables and schedules', async () => {
    const prefs = await setStreakRescue(true);
    expect(prefs.streakRescueEnabled).toBe(true);
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
  });

  it('disables and cancels', async () => {
    await setStreakRescue(true);
    jest.clearAllMocks();
    const prefs = await setStreakRescue(false);
    expect(prefs.streakRescueEnabled).toBe(false);
    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith('speakcoach-streak-rescue');
  });
});

describe('setReminderTime', () => {
  it('reschedules the daily reminder when enabled', async () => {
    await setDailyReminder(true, 9, 0);
    jest.clearAllMocks();
    const prefs = await setReminderTime(18, 45);
    expect(prefs.reminderHour).toBe(18);
    expect(prefs.reminderMinute).toBe(45);
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        trigger: expect.objectContaining({ hour: 18, minute: 45 }),
      }),
    );
  });

  it('does not reschedule when daily reminder is off', async () => {
    const prefs = await setReminderTime(18, 45);
    expect(prefs.dailyReminderEnabled).toBe(false);
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });
});

describe('onPracticeCompleted', () => {
  it('bumps streak rescue when enabled', async () => {
    await saveReminderPrefs({
      dailyReminderEnabled: false,
      reminderHour: 9,
      reminderMinute: 0,
      streakRescueEnabled: true,
      lastPracticeAt: null,
    });
    jest.clearAllMocks();
    await onPracticeCompleted();
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({ identifier: 'speakcoach-streak-rescue' }),
    );
    const prefs = await loadReminderPrefs();
    expect(prefs.lastPracticeAt).not.toBeNull();
  });

  it('does nothing scheduling-wise when streak rescue is disabled', async () => {
    await onPracticeCompleted();
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });
});

describe('initNotifications', () => {
  it('re-applies prefs when permission already granted', async () => {
    await saveReminderPrefs({
      dailyReminderEnabled: true,
      reminderHour: 7,
      reminderMinute: 0,
      streakRescueEnabled: false,
      lastPracticeAt: null,
    });
    await initNotifications();
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        trigger: expect.objectContaining({ hour: 7, minute: 0 }),
      }),
    );
  });

  it('does not schedule when permission is not granted', async () => {
    Notifications.getPermissionsAsync.mockResolvedValue({ granted: false, canAskAgain: true });
    await saveReminderPrefs({
      dailyReminderEnabled: true,
      reminderHour: 7,
      reminderMinute: 0,
      streakRescueEnabled: false,
      lastPracticeAt: null,
    });
    await initNotifications();
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });
});

describe('getPermissionStatus', () => {
  it('returns granted when granted=true', async () => {
    expect(await getPermissionStatus()).toBe('granted');
  });

  it('returns denied when not granted and cannot ask again', async () => {
    Notifications.getPermissionsAsync.mockResolvedValue({ granted: false, canAskAgain: false });
    expect(await getPermissionStatus()).toBe('denied');
  });

  it('returns undetermined when not granted but can ask again', async () => {
    Notifications.getPermissionsAsync.mockResolvedValue({ granted: false, canAskAgain: true });
    expect(await getPermissionStatus()).toBe('undetermined');
  });
});
