import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncGameScore } from '../services/api';

interface GameScore {
  game: string;
  score: number;
  date: string;
  details?: any;
}

const STORAGE_KEY = 'speakcoach_game_scores_v1';

async function loadScores(): Promise<GameScore[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function persistScores(scores: GameScore[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

export async function saveGameScore(game: string, score: number, details?: any): Promise<void> {
  const scores = await loadScores();
  scores.push({ game, score, date: new Date().toISOString(), details });
  await persistScores(scores);
}

export async function saveAndSyncScore(gameName: string, score: number, maxScore: number): Promise<void> {
  await saveGameScore(gameName, score, { maxScore });
  // Fire-and-forget: sync to backend without blocking the game flow
  syncGameScore(gameName, score, maxScore);
}

export async function getHighScore(game: string): Promise<number> {
  const scores = await loadScores();
  const gameScores = scores.filter((s) => s.game === game);
  if (gameScores.length === 0) return 0;
  return Math.max(...gameScores.map((s) => s.score));
}

export async function getRecentScores(game: string, limit = 10): Promise<GameScore[]> {
  const scores = await loadScores();
  return scores
    .filter((s) => s.game === game)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export async function getAllHighScores(): Promise<Record<string, number>> {
  const scores = await loadScores();
  const highs: Record<string, number> = {};
  for (const s of scores) {
    highs[s.game] = Math.max(highs[s.game] ?? 0, s.score);
  }
  return highs;
}
