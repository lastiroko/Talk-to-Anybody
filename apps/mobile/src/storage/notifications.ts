import AsyncStorage from '@react-native-async-storage/async-storage';

const REMINDER_KEY = '@speakcoach/reminderPrefs';

export interface ReminderPrefs {
  dailyReminderEnabled: boolean;
  reminderHour: number;
  reminderMinute: number;
  streakRescueEnabled: boolean;
  lastPracticeAt: string | null;
}

const DEFAULTS: ReminderPrefs = {
  dailyReminderEnabled: false,
  reminderHour: 9,
  reminderMinute: 0,
  streakRescueEnabled: false,
  lastPracticeAt: null,
};

export async function loadReminderPrefs(): Promise<ReminderPrefs> {
  try {
    const raw = await AsyncStorage.getItem(REMINDER_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<ReminderPrefs>;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return { ...DEFAULTS };
  }
}

export async function saveReminderPrefs(prefs: ReminderPrefs): Promise<void> {
  await AsyncStorage.setItem(REMINDER_KEY, JSON.stringify(prefs));
}

export async function updateReminderPrefs(
  patch: Partial<ReminderPrefs>,
): Promise<ReminderPrefs> {
  const current = await loadReminderPrefs();
  const next = { ...current, ...patch };
  await saveReminderPrefs(next);
  return next;
}

export function formatReminderTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const mm = minute.toString().padStart(2, '0');
  return `${h12}:${mm} ${period}`;
}
