import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { loadProgress, markDayCompleted, markDayStarted, saveProgress } from '../storage/progress';
import { getProgressSummary, completeDay as apiCompleteDay, getPlan } from '../services/api';
import { ProgressState } from '../types/progress';

interface ProgressContextValue {
  progress: ProgressState | null;
  loading: boolean;
  completeDay: (dayNumber: number) => Promise<void>;
  startDay: () => Promise<void>;
  resetProgress: () => Promise<void>;
  setProgress: (next: ProgressState) => Promise<void>;
  syncWithBackend: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgressState] = useState<ProgressState | null>(null);
  const [loading, setLoading] = useState(true);
  const progressRef = useRef<ProgressState | null>(null);

  // Keep ref in sync so callbacks always see latest state
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // Reconcile backend data with local state, taking the union of completed days
  const reconcile = useCallback((local: ProgressState, backendDays: number[], backendStreak?: number): ProgressState => {
    const mergedDays = Array.from(new Set([...local.completedDays, ...backendDays])).sort((a, b) => a - b);
    const maxCompleted = mergedDays.length > 0 ? Math.max(...mergedDays) : 0;
    const nextUnlocked = Math.max(local.currentDayUnlocked, maxCompleted + 1);
    const streak = backendStreak != null
      ? Math.max(local.currentStreak, backendStreak)
      : local.currentStreak;

    return {
      ...local,
      completedDays: mergedDays,
      currentDayUnlocked: Math.min(60, nextUnlocked),
      currentStreak: streak,
    };
  }, []);

  // Fetch backend progress and merge with local state
  const fetchAndMerge = useCallback(async (local: ProgressState) => {
    try {
      const summary = await getProgressSummary();
      const merged = reconcile(local, summary.daysCompleted, summary.streak);
      // Only update if something actually changed
      if (
        merged.completedDays.length !== local.completedDays.length ||
        merged.currentDayUnlocked !== local.currentDayUnlocked ||
        merged.currentStreak !== local.currentStreak
      ) {
        setProgressState(merged);
        await saveProgress(merged);
      }
    } catch (error) {
      // Network error — local state is still valid, just skip sync
      console.warn('Background sync failed (using local state):', error);
    }
  }, [reconcile]);

  // On mount: load local first (fast), then sync from backend in background
  useEffect(() => {
    (async () => {
      const local = await loadProgress();
      setProgressState(local);
      setLoading(false);

      // Background sync — don't block the UI
      fetchAndMerge(local);
    })();
  }, [fetchAndMerge]);

  const setAndPersist = useCallback(async (next: ProgressState) => {
    setProgressState(next);
    await saveProgress(next);
  }, []);

  const completeDay = useCallback(
    async (dayNumber: number) => {
      const current = progressRef.current;
      if (!current) return;

      // 1. Update local storage immediately (optimistic)
      const updated = await markDayCompleted(current, dayNumber);
      setProgressState(updated);

      // 2. Sync with backend in background — fire and forget
      apiCompleteDay(dayNumber).catch((error) => {
        console.warn('Failed to sync day completion with backend:', error);
      });
    },
    []
  );

  const startDay = useCallback(async () => {
    const current = progressRef.current;
    if (!current) return;
    const updated = await markDayStarted(current);
    setProgressState(updated);
  }, []);

  const resetProgress = useCallback(async () => {
    const initial = await loadProgress();
    await setAndPersist(initial);
  }, [setAndPersist]);

  // Manual sync: fetches plan status from backend and reconciles with local
  const syncWithBackend = useCallback(async () => {
    const current = progressRef.current;
    if (!current) return;

    try {
      // Try progress summary first
      const summary = await getProgressSummary();
      const merged = reconcile(current, summary.daysCompleted, summary.streak);
      setProgressState(merged);
      await saveProgress(merged);
    } catch {
      // Fall back to plan endpoint
      try {
        const plan = await getPlan();
        const backendCompleted = plan
          .filter((d) => d.status === 'completed')
          .map((d) => d.dayNumber);
        const merged = reconcile(current, backendCompleted);
        setProgressState(merged);
        await saveProgress(merged);
      } catch (error) {
        console.warn('syncWithBackend failed:', error);
      }
    }
  }, [reconcile]);

  const value: ProgressContextValue = {
    progress,
    loading,
    completeDay,
    startDay,
    resetProgress,
    setProgress: setAndPersist,
    syncWithBackend,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return ctx;
}
