import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressState } from '../types/progress';

const STORAGE_KEY = 'speakcoach_progress_v1';
const MAX_DAY = 60;

const defaultProgress: ProgressState = {
  completedDays: [],
  currentDayUnlocked: 1,
  currentStreak: 0,
  lastPracticeDate: null,
};

export async function loadProgress(): Promise<ProgressState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw) as ProgressState;
    return {
      ...defaultProgress,
      ...parsed,
      completedDays: parsed.completedDays ?? [],
      currentDayUnlocked: parsed.currentDayUnlocked ?? 1,
    };
  } catch (error) {
    console.warn('Failed to load progress', error);
    return defaultProgress;
  }
}

export async function saveProgress(state: ProgressState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save progress', error);
  }
}

function isYesterday(dateIso: string | null) {
  if (!dateIso) return false;
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return dateIso === toDateIso(yesterday);
}

function toDateIso(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function markDayCompleted(current: ProgressState, dayNumber: number): Promise<ProgressState> {
  const todayIso = toDateIso(new Date());
  const alreadyCompleted = current.completedDays.includes(dayNumber);
  const completedDays = alreadyCompleted
    ? current.completedDays
    : [...current.completedDays, dayNumber].sort((a, b) => a - b);

  const nextUnlocked = Math.min(MAX_DAY, Math.max(current.currentDayUnlocked, dayNumber + 1));

  let currentStreak = current.currentStreak;
  if (current.lastPracticeDate === todayIso) {
    currentStreak = current.currentStreak || 1;
  } else if (isYesterday(current.lastPracticeDate)) {
    currentStreak = (current.currentStreak || 0) + 1;
  } else {
    currentStreak = 1;
  }

  const updated: ProgressState = {
    completedDays,
    currentDayUnlocked: nextUnlocked,
    currentStreak,
    lastPracticeDate: todayIso,
  };

  await saveProgress(updated);
  return updated;
}

export async function markDayStarted(current: ProgressState): Promise<ProgressState> {
  const todayIso = toDateIso(new Date());
  const updated: ProgressState = {
    ...current,
    lastPracticeDate: todayIso,
    currentStreak: current.currentStreak || 1,
  };
  await saveProgress(updated);
  return updated;
}
