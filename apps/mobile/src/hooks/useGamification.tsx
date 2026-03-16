import { useMemo } from 'react';
import { useProgress } from './useProgress';

export interface GamificationData {
  gems: number;
  coins: number;
  xp: number;
  level: number;
  xpToNextLevel: number;
  xpInLevel: number;
  streak: number;
  dailyChallengeComplete: boolean;
}

export function useGamification(): GamificationData {
  const { progress } = useProgress();

  return useMemo(() => {
    const completedCount = progress?.completedDays.length ?? 0;
    const streak = progress?.currentStreak ?? 0;
    const gems = completedCount * 5;
    const coins = completedCount * 100;
    const xp = completedCount * 50;
    const level = Math.floor(xp / 500) + 1;
    const xpInLevel = xp % 500;
    const xpToNextLevel = 500;
    const currentDay = progress?.currentDayUnlocked ?? 1;
    const dailyChallengeComplete = progress?.completedDays.includes(currentDay) ?? false;

    return {
      gems,
      coins,
      xp,
      level,
      xpToNextLevel,
      xpInLevel,
      streak,
      dailyChallengeComplete,
    };
  }, [progress]);
}
