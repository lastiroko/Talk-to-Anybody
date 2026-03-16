import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveGameScore,
  getHighScore,
  getRecentScores,
  getAllHighScores,
} from '../../src/storage/gameScores';

describe('game scores', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('saveGameScore stores score with date', async () => {
    await saveGameScore('tongue_twister', 85);
    const raw = await AsyncStorage.getItem('speakcoach_game_scores_v1');
    expect(raw).not.toBeNull();
    const scores = JSON.parse(raw!);
    expect(scores).toHaveLength(1);
    expect(scores[0].game).toBe('tongue_twister');
    expect(scores[0].score).toBe(85);
    expect(scores[0].date).toBeDefined();
  });

  it('getHighScore returns 0 when no scores', async () => {
    const high = await getHighScore('tongue_twister');
    expect(high).toBe(0);
  });

  it('getHighScore returns highest score for game', async () => {
    await saveGameScore('tongue_twister', 60);
    await saveGameScore('tongue_twister', 90);
    await saveGameScore('tongue_twister', 75);
    await saveGameScore('other_game', 100);
    const high = await getHighScore('tongue_twister');
    expect(high).toBe(90);
  });

  it('getRecentScores returns last N scores', async () => {
    for (let i = 1; i <= 5; i++) {
      await saveGameScore('tongue_twister', i * 10);
    }
    const recent = await getRecentScores('tongue_twister', 3);
    expect(recent).toHaveLength(3);
    // All returned scores should be from the game
    recent.forEach((s: any) => expect(s.game).toBe('tongue_twister'));
  });

  it('getAllHighScores returns map of game -> high score', async () => {
    await saveGameScore('tongue_twister', 80);
    await saveGameScore('tongue_twister', 95);
    await saveGameScore('pitch_match', 70);
    await saveGameScore('pitch_match', 60);
    const highs = await getAllHighScores();
    expect(highs).toEqual({
      tongue_twister: 95,
      pitch_match: 70,
    });
  });

  it('handles AsyncStorage failure gracefully', async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
      new Error('storage error'),
    );
    const high = await getHighScore('tongue_twister');
    expect(high).toBe(0);
  });
});
