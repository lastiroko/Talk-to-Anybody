import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import GameResultCard from '../components/GameResultCard';
import { saveGameScore, getHighScore } from '../storage/gameScores';

// ---------------------------------------------------------------------------
// Theme constants (inlined per spec)
// ---------------------------------------------------------------------------
const colors = {
  background: '#0A0A0A',
  surface: '#141414',
  primary: '#FF4500',
  primaryDark: '#E63946',
  text: '#FFFFFF',
  muted: '#8A8A8A',
  border: 'rgba(255,255,255,0.08)',
};

const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

const typography = {
  heading: 24,
  subheading: 18,
  body: 16,
  small: 14,
  weightBold: '700' as const,
  weightSemi: '600' as const,
  weightRegular: '400' as const,
  fontRegular: 'JetBrainsMono_400Regular',
  fontSemi: 'JetBrainsMono_600SemiBold',
  fontBold: 'JetBrainsMono_700Bold',
  fontDisplay: 'SpaceGrotesk_700Bold',
};

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------
interface PausePassage {
  id: string;
  text: string;
  idealPauses: {
    afterWord: number; // 0-based word index
    importance: 'critical' | 'good' | 'optional';
    durationSec: number;
  }[];
  estimatedReadTimeSec: number;
}

// ---------------------------------------------------------------------------
// 15 passages
// ---------------------------------------------------------------------------
const PASSAGES: PausePassage[] = [
  {
    id: 'p1',
    text: 'The most important lesson I ever learned came from the person I least expected. My grandmother, who never finished school, taught me that wisdom doesn\'t come from books. It comes from paying attention.',
    idealPauses: [
      { afterWord: 7, importance: 'critical', durationSec: 0.8 },
      { afterWord: 11, importance: 'good', durationSec: 0.5 },
      { afterWord: 14, importance: 'critical', durationSec: 1.0 },
      { afterWord: 16, importance: 'optional', durationSec: 0.4 },
      { afterWord: 20, importance: 'good', durationSec: 0.5 },
      { afterWord: 25, importance: 'critical', durationSec: 0.8 },
      { afterWord: 30, importance: 'good', durationSec: 0.6 },
      { afterWord: 33, importance: 'critical', durationSec: 0.8 },
    ],
    estimatedReadTimeSec: 15,
  },
  {
    id: 'p2',
    text: 'Ladies and gentlemen, today I want to share something that changed my life. Three years ago I was afraid to speak in public. Now I stand before you, not because I conquered that fear, but because I learned to use it.',
    idealPauses: [
      { afterWord: 3, importance: 'good', durationSec: 0.5 },
      { afterWord: 13, importance: 'critical', durationSec: 1.0 },
      { afterWord: 21, importance: 'critical', durationSec: 0.8 },
      { afterWord: 26, importance: 'good', durationSec: 0.5 },
      { afterWord: 31, importance: 'critical', durationSec: 0.8 },
      { afterWord: 37, importance: 'critical', durationSec: 1.0 },
    ],
    estimatedReadTimeSec: 16,
  },
  {
    id: 'p3',
    text: 'What if I told you that everything you believe about success is wrong? Success isn\'t about talent. It isn\'t about luck. It\'s about showing up every single day and doing the work that nobody else wants to do.',
    idealPauses: [
      { afterWord: 11, importance: 'critical', durationSec: 1.0 },
      { afterWord: 15, importance: 'good', durationSec: 0.6 },
      { afterWord: 19, importance: 'good', durationSec: 0.6 },
      { afterWord: 27, importance: 'critical', durationSec: 0.7 },
      { afterWord: 33, importance: 'critical', durationSec: 0.8 },
    ],
    estimatedReadTimeSec: 15,
  },
  {
    id: 'p4',
    text: 'There are moments in life that define who we become. For me, that moment came on a rainy Tuesday afternoon. I received a phone call that would change everything. My father said three words: I believe in you.',
    idealPauses: [
      { afterWord: 9, importance: 'critical', durationSec: 0.8 },
      { afterWord: 12, importance: 'good', durationSec: 0.5 },
      { afterWord: 19, importance: 'critical', durationSec: 0.8 },
      { afterWord: 26, importance: 'critical', durationSec: 1.0 },
      { afterWord: 30, importance: 'good', durationSec: 0.5 },
      { afterWord: 33, importance: 'critical', durationSec: 1.2 },
    ],
    estimatedReadTimeSec: 16,
  },
  {
    id: 'p5',
    text: 'Imagine a world where every child grows up believing they can make a difference. That world starts here. It starts with us. It starts with the choices we make today, in this room, at this very moment.',
    idealPauses: [
      { afterWord: 12, importance: 'critical', durationSec: 0.8 },
      { afterWord: 15, importance: 'good', durationSec: 0.5 },
      { afterWord: 19, importance: 'good', durationSec: 0.5 },
      { afterWord: 26, importance: 'critical', durationSec: 0.6 },
      { afterWord: 28, importance: 'optional', durationSec: 0.4 },
      { afterWord: 31, importance: 'optional', durationSec: 0.4 },
      { afterWord: 35, importance: 'critical', durationSec: 0.8 },
    ],
    estimatedReadTimeSec: 15,
  },
  {
    id: 'p6',
    text: 'They told me it was impossible. They said I was too young, too inexperienced, too different. But here is what they didn\'t understand. Those very things they called weaknesses were actually my greatest strengths.',
    idealPauses: [
      { afterWord: 5, importance: 'critical', durationSec: 0.7 },
      { afterWord: 9, importance: 'optional', durationSec: 0.3 },
      { afterWord: 11, importance: 'optional', durationSec: 0.3 },
      { afterWord: 13, importance: 'good', durationSec: 0.5 },
      { afterWord: 15, importance: 'good', durationSec: 0.4 },
      { afterWord: 20, importance: 'critical', durationSec: 1.0 },
      { afterWord: 28, importance: 'critical', durationSec: 0.8 },
    ],
    estimatedReadTimeSec: 15,
  },
  {
    id: 'p7',
    text: 'Courage is not the absence of fear. Courage is feeling the fear, acknowledging it, and then taking the next step anyway. Every great leader you admire has felt exactly what you feel right now.',
    idealPauses: [
      { afterWord: 6, importance: 'critical', durationSec: 0.8 },
      { afterWord: 11, importance: 'good', durationSec: 0.4 },
      { afterWord: 13, importance: 'good', durationSec: 0.4 },
      { afterWord: 19, importance: 'critical', durationSec: 0.8 },
      { afterWord: 25, importance: 'good', durationSec: 0.5 },
      { afterWord: 31, importance: 'critical', durationSec: 0.7 },
    ],
    estimatedReadTimeSec: 14,
  },
  {
    id: 'p8',
    text: 'Let me ask you a question. When was the last time you did something for the first time? Growth happens at the edge of our comfort zone. Not in the center, where everything is safe. At the edge, where it gets uncomfortable.',
    idealPauses: [
      { afterWord: 5, importance: 'critical', durationSec: 1.0 },
      { afterWord: 16, importance: 'critical', durationSec: 0.8 },
      { afterWord: 23, importance: 'critical', durationSec: 0.7 },
      { afterWord: 26, importance: 'good', durationSec: 0.4 },
      { afterWord: 31, importance: 'critical', durationSec: 0.6 },
      { afterWord: 34, importance: 'good', durationSec: 0.4 },
      { afterWord: 38, importance: 'critical', durationSec: 0.7 },
    ],
    estimatedReadTimeSec: 17,
  },
  {
    id: 'p9',
    text: 'In nineteen sixty-nine, a man walked on the moon. Think about that. An ordinary human being stood on the surface of another world. If we can do that, then what excuse do we have for not chasing our own dreams?',
    idealPauses: [
      { afterWord: 8, importance: 'good', durationSec: 0.5 },
      { afterWord: 10, importance: 'critical', durationSec: 1.0 },
      { afterWord: 20, importance: 'critical', durationSec: 0.8 },
      { afterWord: 25, importance: 'critical', durationSec: 0.7 },
      { afterWord: 28, importance: 'good', durationSec: 0.4 },
      { afterWord: 36, importance: 'critical', durationSec: 0.8 },
    ],
    estimatedReadTimeSec: 16,
  },
  {
    id: 'p10',
    text: 'I used to think leadership was about having all the answers. I was wrong. Leadership is about asking the right questions, listening deeply, and then having the courage to act, even when you are uncertain.',
    idealPauses: [
      { afterWord: 9, importance: 'good', durationSec: 0.5 },
      { afterWord: 12, importance: 'critical', durationSec: 1.0 },
      { afterWord: 18, importance: 'good', durationSec: 0.5 },
      { afterWord: 21, importance: 'optional', durationSec: 0.3 },
      { afterWord: 27, importance: 'critical', durationSec: 0.6 },
      { afterWord: 30, importance: 'good', durationSec: 0.5 },
      { afterWord: 33, importance: 'critical', durationSec: 0.7 },
    ],
    estimatedReadTimeSec: 15,
  },
  {
    id: 'p11',
    text: 'The first step is always the hardest. You stare at the blank page, the empty stage, the silent room. And then you begin. You speak the first word. And somehow, the rest follow. That is the magic of starting.',
    idealPauses: [
      { afterWord: 6, importance: 'critical', durationSec: 0.8 },
      { afterWord: 11, importance: 'optional', durationSec: 0.3 },
      { afterWord: 14, importance: 'optional', durationSec: 0.3 },
      { afterWord: 17, importance: 'critical', durationSec: 0.8 },
      { afterWord: 20, importance: 'good', durationSec: 0.5 },
      { afterWord: 24, importance: 'critical', durationSec: 0.6 },
      { afterWord: 28, importance: 'good', durationSec: 0.5 },
      { afterWord: 31, importance: 'critical', durationSec: 0.8 },
    ],
    estimatedReadTimeSec: 16,
  },
  {
    id: 'p12',
    text: 'We often wait for the perfect moment. The perfect plan. The perfect feeling. But perfection is a trap. The best time to start was yesterday. The second best time is right now. So let us begin.',
    idealPauses: [
      { afterWord: 6, importance: 'good', durationSec: 0.5 },
      { afterWord: 9, importance: 'good', durationSec: 0.5 },
      { afterWord: 12, importance: 'critical', durationSec: 0.8 },
      { afterWord: 17, importance: 'critical', durationSec: 0.7 },
      { afterWord: 23, importance: 'good', durationSec: 0.5 },
      { afterWord: 29, importance: 'critical', durationSec: 0.8 },
      { afterWord: 33, importance: 'critical', durationSec: 1.0 },
    ],
    estimatedReadTimeSec: 15,
  },
  {
    id: 'p13',
    text: 'People will forget what you said. People will forget what you did. But people will never forget how you made them feel. That is the power of authentic communication. It connects us, heart to heart.',
    idealPauses: [
      { afterWord: 5, importance: 'good', durationSec: 0.5 },
      { afterWord: 10, importance: 'good', durationSec: 0.5 },
      { afterWord: 19, importance: 'critical', durationSec: 1.0 },
      { afterWord: 24, importance: 'critical', durationSec: 0.8 },
      { afterWord: 27, importance: 'good', durationSec: 0.4 },
      { afterWord: 31, importance: 'critical', durationSec: 0.7 },
    ],
    estimatedReadTimeSec: 15,
  },
  {
    id: 'p14',
    text: 'Failure is not the opposite of success. It is part of it. Every rejection, every stumble, every closed door teaches you something that success alone never could. Embrace the failures. They are building your story.',
    idealPauses: [
      { afterWord: 7, importance: 'critical', durationSec: 0.8 },
      { afterWord: 12, importance: 'critical', durationSec: 0.7 },
      { afterWord: 14, importance: 'optional', durationSec: 0.3 },
      { afterWord: 17, importance: 'optional', durationSec: 0.3 },
      { afterWord: 24, importance: 'critical', durationSec: 0.8 },
      { afterWord: 27, importance: 'critical', durationSec: 0.7 },
      { afterWord: 33, importance: 'critical', durationSec: 0.8 },
    ],
    estimatedReadTimeSec: 16,
  },
  {
    id: 'p15',
    text: 'Before I leave this stage, I want you to remember one thing. You are enough. Right now, exactly as you are. You do not need permission to be great. You already have everything you need. Now go and prove it.',
    idealPauses: [
      { afterWord: 5, importance: 'good', durationSec: 0.4 },
      { afterWord: 12, importance: 'critical', durationSec: 1.0 },
      { afterWord: 15, importance: 'critical', durationSec: 0.8 },
      { afterWord: 17, importance: 'good', durationSec: 0.4 },
      { afterWord: 21, importance: 'critical', durationSec: 0.7 },
      { afterWord: 27, importance: 'good', durationSec: 0.5 },
      { afterWord: 33, importance: 'critical', durationSec: 0.8 },
      { afterWord: 36, importance: 'critical', durationSec: 1.0 },
    ],
    estimatedReadTimeSec: 17,
  },
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type GameState = 'start' | 'playing' | 'result';

interface TapRecord {
  wordIndex: number;
  quality: 'perfect' | 'good' | 'close' | 'miss';
  points: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const GAME_KEY = 'pause_punch';
const WORD_INTERVAL_MS = 430; // ~2.3 words/sec ≈ 140 WPM

function pickRandomPassage(exclude?: string): PausePassage {
  const pool = exclude ? PASSAGES.filter((p) => p.id !== exclude) : PASSAGES;
  return pool[Math.floor(Math.random() * pool.length)];
}

function scoreTap(
  wordIndex: number,
  passage: PausePassage,
  alreadyHitIndices: Set<number>,
): { quality: 'perfect' | 'good' | 'close' | 'miss'; points: number; matchedPauseIdx: number | null } {
  let bestDist = Infinity;
  let bestIdx = -1;

  for (let i = 0; i < passage.idealPauses.length; i++) {
    if (alreadyHitIndices.has(i)) continue;
    const dist = Math.abs(wordIndex - passage.idealPauses[i].afterWord);
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = i;
    }
  }

  if (bestDist <= 1) {
    const imp = passage.idealPauses[bestIdx]?.importance;
    const pts = imp === 'critical' ? 20 : 15;
    return { quality: 'perfect', points: pts, matchedPauseIdx: bestIdx };
  }
  if (bestDist <= 2) return { quality: 'good', points: 10, matchedPauseIdx: bestIdx };
  if (bestDist <= 4) return { quality: 'close', points: 5, matchedPauseIdx: bestIdx };
  return { quality: 'miss', points: 0, matchedPauseIdx: null };
}

function feedbackLabel(quality: string): string {
  switch (quality) {
    case 'perfect': return '\u{1F3AF} Perfect!';
    case 'good': return '\u{1F44D} Good!';
    case 'close': return 'Close!';
    default: return 'Miss';
  }
}

function feedbackColor(quality: string): string {
  switch (quality) {
    case 'perfect': return '#4ADE80';
    case 'good': return '#FACC15';
    case 'close': return '#FF7A1A';
    default: return '#E63946';
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function PausePunchScreen() {
  const navigation = useNavigation();

  // Game state
  const [gameState, setGameState] = useState<GameState>('start');
  const [highScore, setHighScore] = useState(0);
  const [passage, setPassage] = useState<PausePassage>(() => pickRandomPassage());
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [taps, setTaps] = useState<TapRecord[]>([]);
  const [score, setScore] = useState(0);
  const [hitPauseIndices, setHitPauseIndices] = useState<Set<number>>(new Set());

  // Feedback animation
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackClr, setFeedbackClr] = useState('#4ADE80');
  const feedbackOpacity = useRef(new Animated.Value(0)).current;
  const feedbackScale = useRef(new Animated.Value(0.5)).current;

  // Timer ref
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wordIndexRef = useRef(-1);
  const hitPauseRef = useRef<Set<number>>(new Set());

  // Load high score on mount
  useEffect(() => {
    getHighScore(GAME_KEY).then(setHighScore);
  }, []);

  // Split words when passage changes
  useEffect(() => {
    setWords(passage.text.split(/\s+/));
  }, [passage]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ----- Start game -----
  const startGame = useCallback(() => {
    const p = pickRandomPassage(passage.id);
    setPassage(p);
    setTaps([]);
    setScore(0);
    setHitPauseIndices(new Set());
    hitPauseRef.current = new Set();
    setCurrentWordIndex(0);
    wordIndexRef.current = 0;
    setGameState('playing');

    const w = p.text.split(/\s+/);
    setWords(w);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      wordIndexRef.current += 1;
      const nextIdx = wordIndexRef.current;
      if (nextIdx >= w.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        // Slight delay so last word renders
        setTimeout(() => finishGame(p), 400);
        return;
      }
      setCurrentWordIndex(nextIdx);
    }, WORD_INTERVAL_MS);
  }, [passage]);

  // ----- Finish game -----
  const finishGame = useCallback(
    (p: PausePassage) => {
      // We read taps and hitPauseRef from refs/state at the time of finishing
      // Use a callback form to get latest taps
      setTaps((currentTaps) => {
        setHitPauseIndices((currentHit) => {
          const missed = p.idealPauses.filter((_, i) => !hitPauseRef.current.has(i)).length;
          const missedPenalty = missed * 5;

          const allCriticals = p.idealPauses
            .filter((ip) => ip.importance === 'critical')
            .every((_, i) => {
              const critIdx = p.idealPauses
                .map((ip2, idx) => (ip2.importance === 'critical' ? idx : -1))
                .filter((x) => x >= 0);
              return critIdx.every((ci) => hitPauseRef.current.has(ci));
            });

          let tapScore = 0;
          for (const t of currentTaps) tapScore += t.points;
          let finalScore = tapScore - missedPenalty + (allCriticals ? 25 : 0);
          if (finalScore < 0) finalScore = 0;

          setScore(finalScore);

          // Compute max possible score for result card
          saveGameScore(GAME_KEY, finalScore);
          getHighScore(GAME_KEY).then(setHighScore);

          setGameState('result');
          return currentHit;
        });
        return currentTaps;
      });
    },
    [],
  );

  // ----- Handle tap -----
  const handleTap = useCallback(() => {
    if (gameState !== 'playing') return;
    const wi = wordIndexRef.current;
    if (wi < 0) return;

    const result = scoreTap(wi, passage, hitPauseRef.current);
    const tap: TapRecord = { wordIndex: wi, quality: result.quality, points: result.points };

    if (result.matchedPauseIdx !== null && result.quality !== 'miss') {
      hitPauseRef.current.add(result.matchedPauseIdx);
      setHitPauseIndices(new Set(hitPauseRef.current));
    }

    setTaps((prev) => [...prev, tap]);

    // Show feedback
    setFeedbackText(feedbackLabel(result.quality));
    setFeedbackClr(feedbackColor(result.quality));
    feedbackOpacity.setValue(1);
    feedbackScale.setValue(0.5);

    Animated.parallel([
      Animated.timing(feedbackOpacity, { toValue: 0, duration: 700, useNativeDriver: true }),
      Animated.spring(feedbackScale, { toValue: 1.2, friction: 4, useNativeDriver: true }),
    ]).start();
  }, [gameState, passage, feedbackOpacity, feedbackScale]);

  // ----- Play again -----
  const playAgain = useCallback(() => {
    startGame();
  }, [startGame]);

  // ----- Compute result stats -----
  const computeStats = () => {
    const perfect = taps.filter((t) => t.quality === 'perfect').length;
    const good = taps.filter((t) => t.quality === 'good' || t.quality === 'close').length;
    const missed = passage.idealPauses.filter((_, i) => !hitPauseIndices.has(i)).length;
    const falsePauses = taps.filter((t) => t.quality === 'miss').length;
    return { perfect, good, missed, falsePauses };
  };

  const computeMaxScore = () => {
    let max = 0;
    for (const ip of passage.idealPauses) {
      max += ip.importance === 'critical' ? 20 : 15;
    }
    max += 25; // critical bonus
    return max;
  };

  // =====================================================================
  // RENDER
  // =====================================================================

  // ----- START SCREEN -----
  if (gameState === 'start') {
    return (
      <ScreenContainer>
        <View style={styles.container}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>{'\u23f8\ufe0f'}</Text>
          </View>
          <Text style={styles.title}>Pause Punch</Text>
          <Text style={styles.description}>
            Read the passage aloud. Tap the screen where you'd place a pause. Hit the sweet spots!
          </Text>

          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>High Score</Text>
            <Text style={styles.scoreValue}>{highScore > 0 ? highScore : '--'}</Text>
          </View>

          <PrimaryButton title="Start" onPress={startGame} />
        </View>
      </ScreenContainer>
    );
  }

  // ----- PLAYING SCREEN -----
  if (gameState === 'playing') {
    return (
      <ScreenContainer scroll={false} padded={false}>
        <TouchableOpacity
          style={styles.playArea}
          activeOpacity={0.9}
          onPress={handleTap}
        >
          {/* Score header */}
          <View style={styles.playHeader}>
            <Text style={styles.playScore}>Score: {taps.reduce((s, t) => s + t.points, 0)}</Text>
            <Text style={styles.playProgress}>
              {Math.min(currentWordIndex + 1, words.length)} / {words.length}
            </Text>
          </View>

          {/* Teleprompter */}
          <ScrollView
            style={styles.teleprompterScroll}
            contentContainerStyle={styles.teleprompterContent}
          >
            <View style={styles.wordsContainer}>
              {words.map((word, i) => {
                const isCurrent = i === currentWordIndex;
                const isPast = i < currentWordIndex;
                return (
                  <View
                    key={i}
                    style={[
                      styles.wordWrapper,
                      isCurrent && styles.wordWrapperCurrent,
                    ]}
                  >
                    <Text
                      style={[
                        styles.wordText,
                        isPast && styles.wordPast,
                        isCurrent && styles.wordCurrent,
                      ]}
                    >
                      {word}
                    </Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>

          {/* Tap hint */}
          <Text style={styles.tapHint}>Tap anywhere to place a pause</Text>

          {/* Feedback popup */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.feedbackBubble,
              {
                opacity: feedbackOpacity,
                transform: [{ scale: feedbackScale }],
              },
            ]}
          >
            <Text style={[styles.feedbackText, { color: feedbackClr }]}>{feedbackText}</Text>
          </Animated.View>
        </TouchableOpacity>
      </ScreenContainer>
    );
  }

  // ----- RESULT SCREEN -----
  const stats = computeStats();
  const maxScore = computeMaxScore();

  return (
    <ScreenContainer>
      <View style={styles.resultContainer}>
        <GameResultCard
          gameName="Pause Punch"
          score={score}
          maxScore={maxScore}
          highScore={highScore}
          isNewHighScore={score > 0 && score >= highScore}
          stats={[
            { label: 'Perfect pauses', value: String(stats.perfect) },
            { label: 'Good pauses', value: String(stats.good) },
            { label: 'Missed pauses', value: String(stats.missed) },
            { label: 'False pauses', value: String(stats.falsePauses) },
          ]}
          onPlayAgain={playAgain}
          onExit={() => navigation.goBack()}
        />
      </View>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Start screen
  container: {
    flex: 1,
    gap: spacing.lg,
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,69,0,0.12)',
    borderWidth: 2,
    borderColor: 'rgba(255,69,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  iconEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: typography.heading,
    fontWeight: typography.weightBold,
    fontFamily: typography.fontDisplay,
    color: colors.text,
  },
  description: {
    fontSize: typography.body,
    fontFamily: typography.fontRegular,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.sm,
  },
  scoreCard: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scoreLabel: {
    fontSize: typography.body,
    color: colors.muted,
  },
  scoreValue: {
    fontSize: typography.subheading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },

  // Playing screen
  playArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.lg,
  },
  playHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  playScore: {
    fontSize: typography.subheading,
    fontWeight: typography.weightBold,
    fontFamily: typography.fontBold,
    color: colors.primary,
  },
  playProgress: {
    fontSize: typography.small,
    fontWeight: typography.weightSemi,
    color: colors.muted,
  },
  teleprompterScroll: {
    flex: 1,
  },
  teleprompterContent: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  wordWrapper: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    borderRadius: 6,
  },
  wordWrapperCurrent: {
    backgroundColor: colors.primary,
  },
  wordText: {
    fontSize: 22,
    fontWeight: typography.weightRegular,
    fontFamily: typography.fontRegular,
    color: colors.text,
    lineHeight: 32,
  },
  wordPast: {
    color: '#4A4A4A',
  },
  wordCurrent: {
    color: '#FFFFFF',
    fontWeight: typography.weightBold,
  },
  tapHint: {
    textAlign: 'center',
    fontSize: typography.small,
    color: colors.muted,
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
  },
  feedbackBubble: {
    position: 'absolute',
    top: '45%',
    alignSelf: 'center',
    backgroundColor: '#141414',
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  feedbackText: {
    fontSize: 28,
    fontWeight: typography.weightBold,
    fontFamily: typography.fontBold,
    textAlign: 'center',
  },

  // Result screen
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
