import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { RecordingPanel } from '../components/RecordingPanel';
import GameResultCard from '../components/GameResultCard';
import { saveGameScore, getHighScore } from '../storage/gameScores';

// ─── Theme tokens ────────────────────────────────────────────────────────────
const colors = {
  background: '#ffffff',
  surface: '#f5f7fb',
  primary: '#3b82f6',
  primaryDark: '#1d4ed8',
  text: '#0f172a',
  muted: '#64748b',
  border: '#e2e8f0',
};

const sp = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

const typo = {
  heading: 24,
  subheading: 18,
  body: 16,
  small: 14,
  weightBold: '700' as const,
  weightSemi: '600' as const,
  weightRegular: '400' as const,
};

// ─── Data ────────────────────────────────────────────────────────────────────

type Difficulty = 'easy' | 'medium' | 'hard';

interface ClarityConcept {
  id: string;
  concept: string;
  difficulty: Difficulty;
  keywords: string[];
  simpleAlternatives: string[];
}

const CONCEPTS: ClarityConcept[] = [
  // ── Easy ──
  {
    id: 'e1',
    concept: 'How WiFi works',
    difficulty: 'easy',
    keywords: ['electromagnetic', 'frequency', 'bandwidth', 'protocol'],
    simpleAlternatives: [
      'WiFi is like invisible walkie-talkies. Your phone sends messages through the air to a box (router) that connects to the internet.',
    ],
  },
  {
    id: 'e2',
    concept: 'Why the sky is blue',
    difficulty: 'easy',
    keywords: ['Rayleigh scattering', 'wavelength', 'atmosphere'],
    simpleAlternatives: [
      'Sunlight has all colors mixed in. Blue light bounces around in the air more than other colors, so we see blue everywhere above us.',
    ],
  },
  {
    id: 'e3',
    concept: 'How a refrigerator works',
    difficulty: 'easy',
    keywords: ['compressor', 'refrigerant', 'thermodynamics'],
    simpleAlternatives: [
      'A fridge uses a special liquid that gets very cold. It circulates inside the walls and steals the heat from your food.',
    ],
  },
  {
    id: 'e4',
    concept: 'What is inflation',
    difficulty: 'easy',
    keywords: ['monetary policy', 'aggregate demand', 'CPI'],
    simpleAlternatives: [
      'Inflation means things cost more over time. A candy bar that was $1 last year might be $1.10 this year.',
    ],
  },
  {
    id: 'e5',
    concept: 'How vaccines work',
    difficulty: 'easy',
    keywords: ['antibodies', 'immune response', 'pathogen', 'antigen'],
    simpleAlternatives: [
      "A vaccine shows your body a tiny harmless piece of a germ. Your body practices fighting it so it's ready if the real germ shows up.",
    ],
  },
  {
    id: 'e6',
    concept: 'What is gravity',
    difficulty: 'easy',
    keywords: ['gravitational force', 'mass', 'acceleration'],
    simpleAlternatives: [
      "Heavy things pull other things toward them. The Earth is really heavy, so it pulls us down — that's why we don't float away.",
    ],
  },
  {
    id: 'e7',
    concept: 'How airplanes fly',
    difficulty: 'easy',
    keywords: ['aerodynamics', 'Bernoulli', 'lift coefficient'],
    simpleAlternatives: [
      'Airplane wings are shaped so air moves faster over the top. This creates a push upward that lifts the whole plane into the sky.',
    ],
  },
  {
    id: 'e8',
    concept: 'What is a computer virus',
    difficulty: 'easy',
    keywords: ['malware', 'payload', 'trojan', 'exploit'],
    simpleAlternatives: [
      'A computer virus is a sneaky program that someone made to mess up your computer. It spreads by hiding in files you download.',
    ],
  },
  {
    id: 'e9',
    concept: 'How the internet works',
    difficulty: 'easy',
    keywords: ['TCP/IP', 'packets', 'routing', 'DNS'],
    simpleAlternatives: [
      'The internet is like a giant mail system. When you visit a website, your computer sends a letter asking for it, and the website sends letters back.',
    ],
  },
  {
    id: 'e10',
    concept: 'Why we dream',
    difficulty: 'easy',
    keywords: ['REM sleep', 'subconscious', 'neural consolidation'],
    simpleAlternatives: [
      'When you sleep, your brain sorts through everything from the day. Dreams are like your brain telling stories while it tidies up.',
    ],
  },

  // ── Medium ──
  {
    id: 'm1',
    concept: 'What is machine learning',
    difficulty: 'medium',
    keywords: ['neural network', 'algorithm', 'training data', 'parameters'],
    simpleAlternatives: [
      'Machine learning is when a computer learns from lots of examples instead of being told exact rules. Like showing a kid thousands of cat photos until they can spot any cat.',
    ],
  },
  {
    id: 'm2',
    concept: 'How the stock market works',
    difficulty: 'medium',
    keywords: ['securities', 'derivative', 'portfolio', 'equity'],
    simpleAlternatives: [
      'The stock market is like a huge store where you can buy tiny pieces of companies. If the company does well, your piece becomes worth more.',
    ],
  },
  {
    id: 'm3',
    concept: 'What is DNA',
    difficulty: 'medium',
    keywords: ['nucleotide', 'helix', 'genome', 'chromosome'],
    simpleAlternatives: [
      "DNA is like a recipe book inside every cell of your body. It has instructions for building you — from your eye color to how tall you'll be.",
    ],
  },
  {
    id: 'm4',
    concept: 'How electricity reaches your home',
    difficulty: 'medium',
    keywords: ['transformer', 'voltage', 'grid', 'alternating current'],
    simpleAlternatives: [
      "Power plants make electricity. It travels through wires on tall towers, gets weaker at each step until it's safe, then goes through wires in your walls to your outlets.",
    ],
  },
  {
    id: 'm5',
    concept: 'What is blockchain',
    difficulty: 'medium',
    keywords: ['distributed ledger', 'hash', 'consensus', 'decentralized'],
    simpleAlternatives: [
      "Blockchain is like a shared notebook that everyone can read but nobody can erase. Every time someone writes something, everyone gets a copy.",
    ],
  },
  {
    id: 'm6',
    concept: 'How GPS works',
    difficulty: 'medium',
    keywords: ['triangulation', 'satellite constellation', 'atomic clock'],
    simpleAlternatives: [
      "Your phone talks to satellites in space. By measuring how long signals take to arrive from different satellites, it figures out exactly where you are.",
    ],
  },
  {
    id: 'm7',
    concept: 'What is climate change',
    difficulty: 'medium',
    keywords: ['greenhouse gas', 'carbon dioxide', 'anthropogenic'],
    simpleAlternatives: [
      "Earth is wrapped in a blanket of air. We're making that blanket thicker by burning fuels, so the planet is slowly getting warmer.",
    ],
  },
  {
    id: 'm8',
    concept: 'How batteries work',
    difficulty: 'medium',
    keywords: ['electrochemical', 'cathode', 'anode', 'ion'],
    simpleAlternatives: [
      'A battery is like a tiny energy storage box. Chemicals inside react and push electricity out, like water flowing downhill.',
    ],
  },
  {
    id: 'm9',
    concept: 'What is an algorithm',
    difficulty: 'medium',
    keywords: ['computational complexity', 'heuristic', 'optimization'],
    simpleAlternatives: [
      'An algorithm is just a set of step-by-step instructions, like a recipe. Computers follow these recipes really fast to solve problems.',
    ],
  },
  {
    id: 'm10',
    concept: 'How memory works in the brain',
    difficulty: 'medium',
    keywords: ['hippocampus', 'synaptic plasticity', 'encoding'],
    simpleAlternatives: [
      'Your brain saves memories by strengthening connections between brain cells. The more you practice something, the stronger the connection gets.',
    ],
  },

  // ── Hard ──
  {
    id: 'h1',
    concept: 'What is quantum computing',
    difficulty: 'hard',
    keywords: ['qubit', 'superposition', 'entanglement', 'decoherence'],
    simpleAlternatives: [
      'Normal computers use switches that are on or off. Quantum computers use special switches that can be on AND off at the same time, so they can try many answers at once.',
    ],
  },
  {
    id: 'h2',
    concept: 'How CRISPR gene editing works',
    difficulty: 'hard',
    keywords: ['Cas9', 'guide RNA', 'nuclease', 'genome'],
    simpleAlternatives: [
      "CRISPR is like a pair of tiny scissors for DNA. Scientists can program it to find a specific spot in your genetic code and cut it, like editing a typo in a book.",
    ],
  },
  {
    id: 'h3',
    concept: 'What is general relativity',
    difficulty: 'hard',
    keywords: ['spacetime', 'curvature', 'tensor', 'geodesic'],
    simpleAlternatives: [
      "Heavy things bend the space around them, like putting a bowling ball on a trampoline. Other things roll toward the dip — that's what we call gravity.",
    ],
  },
  {
    id: 'h4',
    concept: 'How mRNA vaccines differ from traditional ones',
    difficulty: 'hard',
    keywords: ['messenger RNA', 'ribosome', 'spike protein'],
    simpleAlternatives: [
      'Traditional vaccines use a weakened germ. mRNA vaccines just send instructions to your cells so they can make one tiny piece of the germ to practice with.',
    ],
  },
  {
    id: 'h5',
    concept: 'What is dark matter',
    difficulty: 'hard',
    keywords: ['gravitational lensing', 'WIMP', 'baryon', 'cosmic microwave'],
    simpleAlternatives: [
      "Scientists noticed galaxies spin too fast for their size. Something invisible must be adding extra weight — we call it dark matter because we can't see it.",
    ],
  },
  {
    id: 'h6',
    concept: 'How nuclear energy works',
    difficulty: 'hard',
    keywords: ['fission', 'isotope', 'chain reaction', 'enrichment'],
    simpleAlternatives: [
      'Atoms have a lot of energy holding them together. In a nuclear plant, we split really heavy atoms apart and the energy that comes out heats water to make electricity.',
    ],
  },
  {
    id: 'h7',
    concept: 'What is consciousness',
    difficulty: 'hard',
    keywords: ['qualia', 'phenomenal experience', 'neural correlates'],
    simpleAlternatives: [
      "Consciousness is the feeling of being 'you' — knowing that you exist, seeing colors, feeling emotions. It's your brain's way of experiencing the world from the inside.",
    ],
  },
  {
    id: 'h8',
    concept: 'How encryption works',
    difficulty: 'hard',
    keywords: ['asymmetric cryptography', 'public key', 'cipher', 'hash function'],
    simpleAlternatives: [
      "Encryption is like putting a message in a locked box. Only the person with the right key can open it. Even if someone steals the box, they can't read what's inside.",
    ],
  },
  {
    id: 'h9',
    concept: 'What is artificial intelligence',
    difficulty: 'hard',
    keywords: ['neural network', 'deep learning', 'GPT', 'transformer'],
    simpleAlternatives: [
      'AI is when computers do things that normally need human thinking — like recognizing faces or writing text. They learn by studying millions of examples.',
    ],
  },
  {
    id: 'h10',
    concept: 'How photosynthesis works',
    difficulty: 'hard',
    keywords: ['chlorophyll', 'carbon fixation', 'Calvin cycle', 'thylakoid'],
    simpleAlternatives: [
      'Plants are like solar-powered food factories. They use sunlight, water, and air to make their own food (sugar) and release the oxygen we breathe.',
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pickRandom(difficulty: Difficulty): ClarityConcept {
  const pool = CONCEPTS.filter((c) => c.difficulty === difficulty);
  return pool[Math.floor(Math.random() * pool.length)];
}

function computeScore(
  durationSec: number,
  difficulty: Difficulty,
  selfRating: number,
): number {
  let score = 0;
  // Completed recording (any duration > 0)
  if (durationSec > 0) score += 40;
  // Used at least 20 seconds
  if (durationSec >= 20) score += 20;
  // Difficulty bonus
  if (difficulty === 'medium') score += 10;
  if (difficulty === 'hard') score += 20;
  // Self-rating bonus
  const ratingBonus: Record<number, number> = { 5: 20, 4: 15, 3: 10, 2: 5, 1: 0 };
  score += ratingBonus[selfRating] ?? 0;
  return Math.min(score, 100);
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

const RATING_LABELS: Record<number, string> = {
  1: 'Very complex',
  2: 'Somewhat complex',
  3: 'Middle ground',
  4: 'Pretty simple',
  5: 'Super simple!',
};

type GameState = 'start' | 'concept' | 'countdown' | 'recording' | 'rating' | 'result';

// ─── Component ───────────────────────────────────────────────────────────────

export function ClaritySprintScreen() {
  const navigation = useNavigation();

  const [gameState, setGameState] = useState<GameState>('start');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentConcept, setCurrentConcept] = useState<ClarityConcept | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [selfRating, setSelfRating] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [highScores, setHighScores] = useState<Record<Difficulty, number>>({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [prevHighScore, setPrevHighScore] = useState(0);

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Load high scores on mount and when returning to start
  const loadHighScores = useCallback(async () => {
    const [easy, medium, hard] = await Promise.all([
      getHighScore('clarity_sprint_easy'),
      getHighScore('clarity_sprint_medium'),
      getHighScore('clarity_sprint_hard'),
    ]);
    setHighScores({ easy, medium, hard });
  }, []);

  useEffect(() => {
    loadHighScores();
  }, [loadHighScores]);

  // Fade-in when game state changes
  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [gameState, fadeAnim]);

  // Cleanup countdown on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // ── Actions ──

  const handleStartGame = useCallback(() => {
    const concept = pickRandom(difficulty);
    setCurrentConcept(concept);
    setRecordingDuration(0);
    setSelfRating(0);
    setFinalScore(0);
    setGameState('concept');

    // Start 5-second countdown, then auto-advance
    let count = 5;
    setCountdown(5);
    countdownRef.current = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        if (countdownRef.current) clearInterval(countdownRef.current);
        setGameState('recording');
      }
    }, 1000);
  }, [difficulty]);

  const handleRecordingComplete = useCallback((_uri: string, durationSec: number) => {
    setRecordingDuration(durationSec);
    setGameState('rating');
  }, []);

  const handleRatingSelected = useCallback(
    async (rating: number) => {
      setSelfRating(rating);
      const score = computeScore(recordingDuration, difficulty, rating);
      setFinalScore(score);

      const prev = highScores[difficulty];
      setPrevHighScore(prev);

      await saveGameScore(`clarity_sprint_${difficulty}`, score, {
        concept: currentConcept?.concept,
        difficulty,
        durationSec: recordingDuration,
        selfRating: rating,
      });
      await loadHighScores();
      setGameState('result');
    },
    [recordingDuration, difficulty, highScores, currentConcept, loadHighScores],
  );

  const handlePlayAgain = useCallback(() => {
    setGameState('start');
  }, []);

  const handleExit = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // ── Render helpers ──

  const renderDifficultyPills = () => {
    const options: Difficulty[] = ['easy', 'medium', 'hard'];
    return (
      <View style={styles.pillRow}>
        {options.map((d) => {
          const active = d === difficulty;
          return (
            <TouchableOpacity
              key={d}
              style={[styles.pill, active && styles.pillActive]}
              onPress={() => setDifficulty(d)}
              activeOpacity={0.7}
            >
              <Text style={[styles.pillText, active && styles.pillTextActive]}>
                {DIFFICULTY_LABELS[d]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderJargonPills = () => {
    if (!currentConcept) return null;
    return (
      <View style={styles.jargonRow}>
        {currentConcept.keywords.map((word) => (
          <View key={word} style={styles.jargonPill}>
            <Text style={styles.jargonPillText}>{word}</Text>
          </View>
        ))}
      </View>
    );
  };

  // ── Screens ──

  // START
  if (gameState === 'start') {
    return (
      <ScreenContainer>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>{'\ud83d\udc8e'}</Text>
          </View>

          <Text style={styles.title}>Clarity Sprint</Text>
          <Text style={styles.description}>
            Explain a complex concept so a 10-year-old would get it. Simpler = better.
            You have 30 seconds.
          </Text>

          {renderDifficultyPills()}

          {/* High scores per difficulty */}
          <View style={styles.highScoreCard}>
            <Text style={styles.highScoreHeading}>High Scores</Text>
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
              <View key={d} style={styles.highScoreRow}>
                <Text style={styles.highScoreLabel}>{DIFFICULTY_LABELS[d]}</Text>
                <Text style={styles.highScoreValue}>
                  {highScores[d] > 0 ? `${highScores[d]}/100` : '--'}
                </Text>
              </View>
            ))}
          </View>

          <PrimaryButton title="Give me a concept" onPress={handleStartGame} />
        </Animated.View>
      </ScreenContainer>
    );
  }

  // CONCEPT REVEAL + COUNTDOWN
  if (gameState === 'concept') {
    return (
      <ScreenContainer>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <View style={styles.conceptCard}>
            <Text style={styles.conceptLabel}>Your concept:</Text>
            <Text style={styles.conceptTitle}>{currentConcept?.concept}</Text>
          </View>

          <View style={styles.avoidSection}>
            <Text style={styles.avoidHeading}>{'\ud83d\udeab'} Avoid these words:</Text>
            {renderJargonPills()}
          </View>

          <View style={styles.countdownCircle}>
            <Text style={styles.countdownNumber}>{countdown}</Text>
          </View>
          <Text style={styles.countdownHint}>
            Think about how to simplify this...
          </Text>
        </Animated.View>
      </ScreenContainer>
    );
  }

  // RECORDING
  if (gameState === 'recording') {
    return (
      <ScreenContainer>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          {/* Concept reminder at top */}
          <View style={styles.conceptReminder}>
            <Text style={styles.conceptReminderText}>
              {currentConcept?.concept}
            </Text>
          </View>

          {/* Jargon reminder */}
          <View style={styles.avoidSectionSmall}>
            <Text style={styles.avoidHintSmall}>{'\ud83d\udeab'} Avoid:</Text>
            {renderJargonPills()}
          </View>

          {/* Recording panel */}
          <RecordingPanel
            maxDurationSec={30}
            minDurationSec={1}
            showPlayback={false}
            showPauseResume={false}
            onRecordingComplete={handleRecordingComplete}
            promptText="Start explaining — keep it simple!"
          />
        </Animated.View>
      </ScreenContainer>
    );
  }

  // SELF-RATING
  if (gameState === 'rating') {
    return (
      <ScreenContainer>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <Text style={styles.ratingTitle}>How simple was your explanation?</Text>
          <Text style={styles.ratingSubtitle}>
            Be honest — this is about learning, not just scoring!
          </Text>

          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((r) => {
              const active = selfRating === r;
              return (
                <TouchableOpacity
                  key={r}
                  style={[styles.ratingCircle, active && styles.ratingCircleActive]}
                  onPress={() => setSelfRating(r)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.ratingCircleText, active && styles.ratingCircleTextActive]}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selfRating > 0 && (
            <Text style={styles.ratingLabel}>{RATING_LABELS[selfRating]}</Text>
          )}

          <View style={styles.ratingMeta}>
            <Text style={styles.ratingMetaText}>
              Speaking time: {recordingDuration}s
            </Text>
            <Text style={styles.ratingMetaText}>
              Difficulty: {DIFFICULTY_LABELS[difficulty]}
            </Text>
          </View>

          <PrimaryButton
            title="See Results"
            onPress={() => handleRatingSelected(selfRating)}
            disabled={selfRating === 0}
          />
        </Animated.View>
      </ScreenContainer>
    );
  }

  // RESULT
  if (gameState === 'result') {
    const isNewHigh = finalScore > prevHighScore;

    return (
      <ScreenContainer>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          {/* Simple alternative learning moment */}
          <View style={styles.simpleAltCard}>
            <Text style={styles.simpleAltHeading}>
              {'\ud83d\udca1'} Here's one way to explain it simply:
            </Text>
            <Text style={styles.simpleAltText}>
              {currentConcept?.simpleAlternatives[0]}
            </Text>
          </View>

          <GameResultCard
            gameName="Clarity Sprint"
            score={finalScore}
            maxScore={100}
            highScore={prevHighScore}
            isNewHighScore={isNewHigh}
            stats={[
              { label: 'Speaking time', value: `${recordingDuration}s` },
              { label: 'Difficulty', value: DIFFICULTY_LABELS[difficulty] },
              { label: 'Self-rated simplicity', value: `${selfRating}/5` },
            ]}
            onPlayAgain={handlePlayAgain}
            onExit={handleExit}
          />
        </Animated.View>
      </ScreenContainer>
    );
  }

  // Fallback
  return null;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: sp.lg,
    alignItems: 'center',
  },

  // ── Start screen ──
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3e8ff',
    borderWidth: 2,
    borderColor: '#c4b5fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: sp.md,
  },
  iconEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: typo.heading,
    fontWeight: typo.weightBold,
    color: colors.text,
  },
  description: {
    fontSize: typo.body,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: sp.sm,
  },

  // Difficulty pills
  pillRow: {
    flexDirection: 'row',
    gap: sp.sm,
  },
  pill: {
    paddingVertical: sp.sm,
    paddingHorizontal: sp.lg,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: typo.small,
    fontWeight: typo.weightSemi,
    color: colors.muted,
  },
  pillTextActive: {
    color: '#ffffff',
  },

  // High scores
  highScoreCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: sp.lg,
    gap: sp.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  highScoreHeading: {
    fontSize: typo.subheading,
    fontWeight: typo.weightBold,
    color: colors.text,
    marginBottom: sp.xs,
  },
  highScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  highScoreLabel: {
    fontSize: typo.body,
    color: colors.muted,
  },
  highScoreValue: {
    fontSize: typo.body,
    fontWeight: typo.weightBold,
    color: colors.text,
  },

  // ── Concept reveal ──
  conceptCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: sp.xl,
    alignItems: 'center',
    gap: sp.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: sp.lg,
  },
  conceptLabel: {
    fontSize: typo.small,
    fontWeight: typo.weightSemi,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  conceptTitle: {
    fontSize: typo.heading,
    fontWeight: typo.weightBold,
    color: colors.text,
    textAlign: 'center',
  },

  // Avoid / jargon
  avoidSection: {
    width: '100%',
    gap: sp.sm,
  },
  avoidHeading: {
    fontSize: typo.body,
    fontWeight: typo.weightSemi,
    color: '#ef4444',
  },
  jargonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: sp.sm,
  },
  jargonPill: {
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    paddingVertical: sp.xs,
    paddingHorizontal: sp.md,
  },
  jargonPillText: {
    fontSize: typo.small,
    fontWeight: typo.weightSemi,
    color: '#ef4444',
  },

  // Countdown
  countdownCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: sp.md,
  },
  countdownNumber: {
    fontSize: 48,
    fontWeight: typo.weightBold,
    color: colors.primary,
  },
  countdownHint: {
    fontSize: typo.body,
    color: colors.muted,
    fontStyle: 'italic',
  },

  // ── Recording screen ──
  conceptReminder: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: sp.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginTop: sp.sm,
  },
  conceptReminderText: {
    fontSize: typo.subheading,
    fontWeight: typo.weightBold,
    color: colors.text,
    textAlign: 'center',
  },
  avoidSectionSmall: {
    width: '100%',
    gap: sp.xs,
  },
  avoidHintSmall: {
    fontSize: typo.small,
    fontWeight: typo.weightSemi,
    color: '#ef4444',
  },

  // ── Rating screen ──
  ratingTitle: {
    fontSize: typo.heading,
    fontWeight: typo.weightBold,
    color: colors.text,
    textAlign: 'center',
    marginTop: sp.xl,
  },
  ratingSubtitle: {
    fontSize: typo.body,
    color: colors.muted,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    gap: sp.md,
    marginTop: sp.md,
  },
  ratingCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingCircleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  ratingCircleText: {
    fontSize: typo.subheading,
    fontWeight: typo.weightBold,
    color: colors.text,
  },
  ratingCircleTextActive: {
    color: '#ffffff',
  },
  ratingLabel: {
    fontSize: typo.body,
    fontWeight: typo.weightSemi,
    color: colors.primary,
  },
  ratingMeta: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: sp.md,
    gap: sp.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ratingMetaText: {
    fontSize: typo.small,
    color: colors.muted,
  },

  // ── Result screen ──
  simpleAltCard: {
    width: '100%',
    backgroundColor: '#f0fdf4',
    borderRadius: 14,
    padding: sp.lg,
    gap: sp.sm,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginTop: sp.md,
  },
  simpleAltHeading: {
    fontSize: typo.body,
    fontWeight: typo.weightBold,
    color: '#15803d',
  },
  simpleAltText: {
    fontSize: typo.body,
    color: colors.text,
    lineHeight: 24,
  },
});
