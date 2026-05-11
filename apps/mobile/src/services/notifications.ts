import { Platform } from 'react-native';
import {
  loadReminderPrefs,
  saveReminderPrefs,
  updateReminderPrefs,
  ReminderPrefs,
} from '../storage/notifications';

// expo-notifications is loaded lazily so the module can be imported safely in
// environments where the native module isn't available (Expo Go on certain
// platforms, jest tests, web). Every call that needs it will go through
// `loadNotifications()` and gracefully no-op when unavailable.

type NotificationsModule = typeof import('expo-notifications');
type DeviceModule = typeof import('expo-device');

let cached: NotificationsModule | null = null;
let cachedDevice: DeviceModule | null = null;
let configured = false;

const DAILY_REMINDER_ID = 'speakcoach-daily-reminder';
const STREAK_RESCUE_ID = 'speakcoach-streak-rescue';

const DAILY_MESSAGES = [
  { title: 'Time to speak.', body: 'Your 10-minute session is waiting.' },
  { title: 'One session, real progress.', body: 'Open SpeakCoach and warm up your voice.' },
  { title: 'Confidence compounds.', body: 'A few minutes today beats an hour next week.' },
  { title: 'Your future self is listening.', body: 'Tap to start today’s practice.' },
];

const STREAK_RESCUE_MESSAGES = [
  { title: 'Don’t break the streak.', body: 'A 90-second drill keeps it alive.' },
  { title: 'Streak rescue available.', body: 'Open SpeakCoach now to save your streak.' },
];

function pickMessage(list: typeof DAILY_MESSAGES) {
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
}

async function loadNotifications(): Promise<NotificationsModule | null> {
  if (cached) return cached;
  try {
    // require() works the same in Jest (jest.mock applies) and in runtime
    // tslint:disable-next-line:no-var-requires
    const mod = require('expo-notifications') as NotificationsModule;
    cached = mod;
    return mod;
  } catch (err) {
    console.warn('[notifications] expo-notifications unavailable:', (err as Error).message);
    return null;
  }
}

async function loadDevice(): Promise<DeviceModule | null> {
  if (cachedDevice) return cachedDevice;
  try {
    // tslint:disable-next-line:no-var-requires
    const mod = require('expo-device') as DeviceModule;
    cachedDevice = mod;
    return mod;
  } catch {
    return null;
  }
}

async function ensureConfigured(N: NotificationsModule) {
  if (configured) return;
  configured = true;
  N.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      // Newer expo-notifications fields — safe to include
      shouldShowBanner: true,
      shouldShowList: true,
    } as any),
  });
  if (Platform.OS === 'android') {
    try {
      await N.setNotificationChannelAsync('default', {
        name: 'Daily practice',
        importance: N.AndroidImportance.DEFAULT,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
        lockscreenVisibility: N.AndroidNotificationVisibility.PUBLIC,
      });
    } catch {
      // ignore — channel may already exist
    }
  }
}

export async function isPushSupported(): Promise<boolean> {
  const device = await loadDevice();
  if (!device) return false;
  if (Platform.OS === 'web') return false;
  return device.isDevice;
}

export async function getPermissionStatus(): Promise<'granted' | 'denied' | 'undetermined'> {
  const N = await loadNotifications();
  if (!N) return 'undetermined';
  await ensureConfigured(N);
  const res = await N.getPermissionsAsync();
  if (res.granted) return 'granted';
  if (res.canAskAgain) return 'undetermined';
  return 'denied';
}

export async function requestPermission(): Promise<boolean> {
  const N = await loadNotifications();
  if (!N) return false;
  await ensureConfigured(N);
  const supported = await isPushSupported();
  if (!supported) return false;
  const res = await N.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: true,
    },
  });
  return !!res.granted;
}

async function cancelById(N: NotificationsModule, identifier: string) {
  try {
    await N.cancelScheduledNotificationAsync(identifier);
  } catch {
    // identifier may not exist — ignore
  }
}

export async function cancelDailyReminder(): Promise<void> {
  const N = await loadNotifications();
  if (!N) return;
  await ensureConfigured(N);
  await cancelById(N, DAILY_REMINDER_ID);
}

export async function cancelStreakRescue(): Promise<void> {
  const N = await loadNotifications();
  if (!N) return;
  await ensureConfigured(N);
  await cancelById(N, STREAK_RESCUE_ID);
}

export async function cancelAllReminders(): Promise<void> {
  const N = await loadNotifications();
  if (!N) return;
  await ensureConfigured(N);
  await N.cancelAllScheduledNotificationsAsync().catch(() => undefined);
}

export async function scheduleDailyReminder(
  hour: number,
  minute: number,
): Promise<boolean> {
  const N = await loadNotifications();
  if (!N) return false;
  await ensureConfigured(N);
  const granted = (await N.getPermissionsAsync()).granted;
  if (!granted) return false;

  await cancelById(N, DAILY_REMINDER_ID);
  const msg = pickMessage(DAILY_MESSAGES);

  try {
    await N.scheduleNotificationAsync({
      identifier: DAILY_REMINDER_ID,
      content: {
        title: msg.title,
        body: msg.body,
        sound: 'default',
        data: { type: 'daily-reminder' },
      },
      trigger: {
        // Daily repeating trigger — supported across SDK 54
        hour,
        minute,
        repeats: true,
      } as any,
    });
    return true;
  } catch (err) {
    console.warn('[notifications] scheduleDailyReminder failed:', (err as Error).message);
    return false;
  }
}

export async function scheduleStreakRescue(hoursFromNow = 20): Promise<boolean> {
  const N = await loadNotifications();
  if (!N) return false;
  await ensureConfigured(N);
  const granted = (await N.getPermissionsAsync()).granted;
  if (!granted) return false;

  await cancelById(N, STREAK_RESCUE_ID);
  const msg = pickMessage(STREAK_RESCUE_MESSAGES);
  const seconds = Math.max(60, Math.floor(hoursFromNow * 3600));

  try {
    await N.scheduleNotificationAsync({
      identifier: STREAK_RESCUE_ID,
      content: {
        title: msg.title,
        body: msg.body,
        sound: 'default',
        data: { type: 'streak-rescue' },
      },
      trigger: {
        seconds,
        repeats: false,
      } as any,
    });
    return true;
  } catch (err) {
    console.warn('[notifications] scheduleStreakRescue failed:', (err as Error).message);
    return false;
  }
}

export async function applyReminderPrefs(prefs: ReminderPrefs): Promise<ReminderPrefs> {
  // Daily reminder
  if (prefs.dailyReminderEnabled) {
    const ok = await scheduleDailyReminder(prefs.reminderHour, prefs.reminderMinute);
    if (!ok) {
      // Could not schedule (permission denied or unsupported) — flip off so UI stays honest
      const next = { ...prefs, dailyReminderEnabled: false };
      await saveReminderPrefs(next);
      return next;
    }
  } else {
    await cancelDailyReminder();
  }

  // Streak rescue
  if (prefs.streakRescueEnabled) {
    await scheduleStreakRescue(20);
  } else {
    await cancelStreakRescue();
  }

  return prefs;
}

export async function setDailyReminder(
  enabled: boolean,
  hour?: number,
  minute?: number,
): Promise<ReminderPrefs> {
  if (enabled) {
    const granted = await requestPermission();
    if (!granted) {
      const prefs = await updateReminderPrefs({ dailyReminderEnabled: false });
      return prefs;
    }
  }
  const patch: Partial<ReminderPrefs> = { dailyReminderEnabled: enabled };
  if (typeof hour === 'number') patch.reminderHour = hour;
  if (typeof minute === 'number') patch.reminderMinute = minute;
  const next = await updateReminderPrefs(patch);
  await applyReminderPrefs(next);
  return next;
}

export async function setStreakRescue(enabled: boolean): Promise<ReminderPrefs> {
  if (enabled) {
    const granted = await requestPermission();
    if (!granted) {
      return updateReminderPrefs({ streakRescueEnabled: false });
    }
  }
  const next = await updateReminderPrefs({ streakRescueEnabled: enabled });
  await applyReminderPrefs(next);
  return next;
}

export async function setReminderTime(
  hour: number,
  minute: number,
): Promise<ReminderPrefs> {
  const next = await updateReminderPrefs({ reminderHour: hour, reminderMinute: minute });
  if (next.dailyReminderEnabled) {
    await scheduleDailyReminder(next.reminderHour, next.reminderMinute);
  }
  return next;
}

// Called when the user completes a day — bumps streak rescue if enabled
export async function onPracticeCompleted(): Promise<void> {
  const prefs = await updateReminderPrefs({ lastPracticeAt: new Date().toISOString() });
  if (prefs.streakRescueEnabled) {
    await scheduleStreakRescue(20);
  }
}

// Called on app launch — re-applies stored prefs so reminders survive reinstall reset
export async function initNotifications(): Promise<void> {
  const supported = await isPushSupported();
  if (!supported) return;
  const N = await loadNotifications();
  if (!N) return;
  await ensureConfigured(N);
  const prefs = await loadReminderPrefs();
  // Only re-schedule if permission is already granted — never prompt at startup
  const perm = await N.getPermissionsAsync();
  if (perm.granted) {
    await applyReminderPrefs(prefs);
  }
}
