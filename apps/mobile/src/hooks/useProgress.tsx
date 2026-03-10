import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { loadProgress, markDayCompleted, markDayStarted, saveProgress } from '../storage/progress';
import { ProgressState } from '../types/progress';

interface ProgressContextValue {
  progress: ProgressState | null;
  loading: boolean;
  completeDay: (dayNumber: number) => Promise<void>;
  startDay: () => Promise<void>;
  resetProgress: () => Promise<void>;
  setProgress: (next: ProgressState) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgressState] = useState<ProgressState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const initial = await loadProgress();
      setProgressState(initial);
      setLoading(false);
    })();
  }, []);

  const setAndPersist = useCallback(async (next: ProgressState) => {
    setProgressState(next);
    await saveProgress(next);
  }, []);

  const completeDay = useCallback(
    async (dayNumber: number) => {
      if (!progress) return;
      const updated = await markDayCompleted(progress, dayNumber);
      setProgressState(updated);
    },
    [progress]
  );

  const startDay = useCallback(async () => {
    if (!progress) return;
    const updated = await markDayStarted(progress);
    setProgressState(updated);
  }, [progress]);

  const resetProgress = useCallback(async () => {
    const initial = await loadProgress();
    await setAndPersist(initial);
  }, [setAndPersist]);

  const value: ProgressContextValue = {
    progress,
    loading,
    completeDay,
    startDay,
    resetProgress,
    setProgress: setAndPersist,
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
