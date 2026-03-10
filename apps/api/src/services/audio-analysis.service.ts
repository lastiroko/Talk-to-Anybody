interface TranscriptWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
}

interface AudioMetrics {
  wpm: number;
  fillerPerMin: number;
  avgPauseSec: number;
  pitchRangeHz: number;
  vocalVariety: number;
  fillerWords: { word: string; timestamp: number }[];
  pauseLocations: { start: number; end: number; durationSec: number }[];
  totalFillers: number;
}

const FILLER_WORDS = new Set([
  'um', 'uh', 'like', 'you know', 'so', 'basically', 'actually',
  'literally', 'right', 'okay', 'er', 'ah', 'well',
]);

export function analyzeAudioMetrics(
  words: TranscriptWord[],
  durationSec: number,
): AudioMetrics {
  if (words.length === 0 || durationSec === 0) {
    return {
      wpm: 0, fillerPerMin: 0, avgPauseSec: 0, pitchRangeHz: 0,
      vocalVariety: 50, fillerWords: [], pauseLocations: [], totalFillers: 0,
    };
  }

  // WPM
  const durationMin = durationSec / 60;
  const wpm = Math.round(words.length / durationMin);

  // Filler detection
  const fillerWords: { word: string; timestamp: number }[] = [];
  for (const w of words) {
    if (FILLER_WORDS.has(w.word.toLowerCase().replace(/[.,!?]/g, ''))) {
      fillerWords.push({ word: w.word, timestamp: w.start });
    }
  }
  const totalFillers = fillerWords.length;
  const fillerPerMin = Math.round((totalFillers / durationMin) * 10) / 10;

  // Pause detection (gaps > 0.5s between words)
  const pauseLocations: { start: number; end: number; durationSec: number }[] = [];
  for (let i = 1; i < words.length; i++) {
    const gap = words[i].start - words[i - 1].end;
    if (gap > 0.5) {
      pauseLocations.push({
        start: words[i - 1].end,
        end: words[i].start,
        durationSec: Math.round(gap * 100) / 100,
      });
    }
  }
  const avgPauseSec = pauseLocations.length > 0
    ? Math.round(
        (pauseLocations.reduce((s, p) => s + p.durationSec, 0) / pauseLocations.length) * 100,
      ) / 100
    : 0;

  // Mock pitch range (would need actual audio analysis with librosa/praat)
  const pitchRangeHz = 60 + Math.floor(Math.random() * 80);

  // Vocal variety score (composite of pace variation + pause usage)
  const paceVariation = Math.min(
    100,
    Math.abs(wpm - 150) < 30 ? 70 + Math.random() * 20 : 40 + Math.random() * 30,
  );
  const pauseScore = Math.min(
    100,
    pauseLocations.length > 2 ? 60 + Math.random() * 25 : 30 + Math.random() * 30,
  );
  const vocalVariety = Math.round((paceVariation + pauseScore) / 2);

  return {
    wpm, fillerPerMin, avgPauseSec, pitchRangeHz, vocalVariety,
    fillerWords, pauseLocations, totalFillers,
  };
}
