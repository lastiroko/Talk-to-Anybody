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
import GameResultCard from '../components/GameResultCard';
import { saveGameScore, getHighScore } from '../storage/gameScores';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';

// ---------------------------------------------------------------------------
// Theme (inline to keep self-contained)
// ---------------------------------------------------------------------------
const colors = {
  background: '#ffffff',
  surface: '#f5f7fb',
  primary: '#3b82f6',
  primaryDark: '#1d4ed8',
  text: '#0f172a',
  muted: '#64748b',
  border: '#e2e8f0',
};

const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

const typography = {
  heading: 24,
  subheading: 18,
  body: 16,
  small: 14,
  weightBold: '700' as '700',
  weightSemi: '600' as '600',
  weightRegular: '400' as '400',
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const ABT_TOPICS: string[] = [
  'Learning to cook',
  'Moving to a new city',
  'Starting a new job',
  'Making a big purchase',
  'Losing your phone for a day',
  'Meeting your childhood hero',
  'Working from home',
  'Learning a new language',
  'Training for a marathon',
  'Adopting a pet',
  'Going on a blind date',
  'Starting a business',
  'Taking a gap year',
  'Learning to drive',
  'Public transportation adventures',
  'Dealing with a difficult coworker',
  'Cooking for a dinner party',
  'Traveling solo for the first time',
  'Switching careers',
  'Building a piece of furniture',
  'Babysitting for the first time',
  'Growing a garden',
  'Fixing something yourself instead of hiring help',
  'Volunteering abroad',
  'Performing on stage',
];

const GAME_NAME = 'ABT Builder';
const MAX_PHASE_SECONDS = 20;

type GameState =
  | 'start'
  | 'topic'
  | 'countdown'
  | 'phase1'
  | 'phase2'
  | 'phase3'
  | 'result';

interface PhaseConfig {
  key: 'phase1' | 'phase2' | 'phase3';
  label: string;
  emoji: string;
  bgColor: string;
  helperPrefix: string;
}

const PHASES: PhaseConfig[] = [
  {
    key: 'phase1',
    label: 'AND — Set the scene',
    emoji: '🟢',
    bgColor: '#dcfce7',
    helperPrefix: 'I wanted to [topic] AND...',
  },
  {
    key: 'phase2',
    label: 'BUT — The twist',
    emoji: '🟡',
    bgColor: '#fef3c7',
    helperPrefix: 'BUT then...',
  },
  {
    key: 'phase3',
    label: 'THEREFORE — The lesson',
    emoji: '🔴',
    bgColor: '#fee2e2',
    helperPrefix: 'THEREFORE I learned...',
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ABTBuilderScreen() {
  const navigation = useNavigation();

  // Game state
  const [gameState, setGameState] = useState<GameState>('start');
  const [topic, setTopic] = useState('');
  const [highScore, setHighScore] = useState(0);
  const [topicCountdown, setTopicCountdown] = useState(5);
  const [phaseDurations, setPhaseDurations] = useState<number[]>([0, 0, 0]);

  // Recording phase state
  const [isRecording, setIsRecording] = useState(false);
  const [phaseTimer, setPhaseTimer] = useState(MAX_PHASE_SECONDS);
  const phaseTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseStartRef = useRef<number>(0);

  // Result
  const [score, setScore] = useState(0);

  // Pulse animation for recording indicator
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Load high score on mount
  useEffect(() => {
    getHighScore(GAME_NAME).then(setHighScore);
  }, []);

  // Pulse animation loop while recording
  useEffect(() => {
    if (isRecording) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording, pulseAnim]);

  // Topic countdown timer
  useEffect(() => {
    if (gameState !== 'countdown') return;
    if (topicCountdown <= 0) {
      setGameState('phase1');
      return;
    }
    const id = setTimeout(() => setTopicCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [gameState, topicCountdown]);

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  const pickTopic = useCallback(() => {
    const idx = Math.floor(Math.random() * ABT_TOPICS.length);
    setTopic(ABT_TOPICS[idx]);
  }, []);

  const currentPhaseIndex = (): number => {
    if (gameState === 'phase1') return 0;
    if (gameState === 'phase2') return 1;
    if (gameState === 'phase3') return 2;
    return -1;
  };

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setPhaseTimer(MAX_PHASE_SECONDS);
    phaseStartRef.current = Date.now();

    phaseTimerRef.current = setInterval(() => {
      setPhaseTimer((prev) => {
        if (prev <= 1) {
          // Time's up — auto-finish
          finishRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const finishRecording = useCallback(() => {
    if (phaseTimerRef.current) {
      clearInterval(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }

    const elapsed = Math.round((Date.now() - phaseStartRef.current) / 1000);
    const idx = currentPhaseIndex();
    setIsRecording(false);

    setPhaseDurations((prev) => {
      const next = [...prev];
      next[idx] = Math.min(elapsed, MAX_PHASE_SECONDS);
      return next;
    });

    // Advance to next state
    if (gameState === 'phase1') {
      setGameState('phase2');
    } else if (gameState === 'phase2') {
      setGameState('phase3');
    } else if (gameState === 'phase3') {
      // Calculate score in a moment after state update
      setTimeout(() => {
        computeAndFinish(elapsed);
      }, 100);
    }
  }, [gameState, phaseDurations]);

  const computeAndFinish = useCallback(
    (phase3Duration: number) => {
      const durations = [
        phaseDurations[0],
        phaseDurations[1],
        Math.min(phase3Duration, MAX_PHASE_SECONDS),
      ];

      // Base score for completion
      let total = 50;

      // +10 per phase if > 15s
      for (const d of durations) {
        if (d > 15) total += 10;
      }

      // +10 if no phase stopped early (all >= 20)
      const allFull = durations.every((d) => d >= MAX_PHASE_SECONDS);
      if (allFull) total += 10;

      // +10 if total >= 60
      const totalTime = durations.reduce((a, b) => a + b, 0);
      if (totalTime >= 60) total += 10;

      // Cap at 100
      total = Math.min(total, 100);

      setScore(total);

      // Persist
      saveGameScore(GAME_NAME, total, { durations });
      getHighScore(GAME_NAME).then(setHighScore);

      // Update durations for display
      setPhaseDurations(durations);
      setGameState('result');
    },
    [phaseDurations],
  );

  const resetGame = useCallback(() => {
    setGameState('start');
    setTopic('');
    setTopicCountdown(5);
    setPhaseDurations([0, 0, 0]);
    setScore(0);
    setIsRecording(false);
    if (phaseTimerRef.current) {
      clearInterval(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }
    getHighScore(GAME_NAME).then(setHighScore);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Renderers
  // ---------------------------------------------------------------------------
  const renderStart = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.iconCircle}>
        <Text style={styles.iconEmoji}>📖</Text>
      </View>

      <Text style={styles.title}>ABT Builder</Text>

      <Text style={styles.description}>
        Build a story in 3 phases: AND (setup), BUT (twist), THEREFORE
        (lesson). You get a random topic and 20 seconds per phase.
      </Text>

      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>High Score</Text>
        <Text style={styles.scoreValue}>
          {highScore > 0 ? `${highScore}/100` : '--'}
        </Text>
      </View>

      <PrimaryButton
        title="Get a Topic"
        onPress={() => {
          pickTopic();
          setGameState('topic');
        }}
      />
    </ScrollView>
  );

  const renderTopicReveal = () => (
    <View style={styles.centeredContainer}>
      <View style={styles.topicCard}>
        <Text style={styles.topicLabel}>Your topic:</Text>
        <Text style={styles.topicText}>{topic}</Text>
      </View>

      <View style={{ marginTop: spacing.xl }} />

      <PrimaryButton
        title="I'm Ready — Start!"
        onPress={() => {
          setTopicCountdown(5);
          setGameState('countdown');
        }}
      />
    </View>
  );

  const renderCountdown = () => (
    <View style={styles.centeredContainer}>
      <Text style={styles.countdownSubtext}>Think about your story...</Text>
      <Text style={styles.countdownNumber}>{topicCountdown}</Text>
      <Text style={styles.countdownSubtext}>
        Topic: {topic}
      </Text>
    </View>
  );

  const renderPhase = () => {
    const idx = currentPhaseIndex();
    if (idx < 0) return null;
    const phase = PHASES[idx];
    const helperText = phase.helperPrefix.replace('[topic]', topic.toLowerCase());

    return (
      <View style={styles.centeredContainer}>
        {/* Phase header */}
        <View style={[styles.phaseHeader, { backgroundColor: phase.bgColor }]}>
          <Text style={styles.phaseHeaderText}>
            {phase.emoji} {phase.label}
          </Text>
        </View>

        {/* Topic reminder */}
        <Text style={styles.topicReminder}>Topic: {topic}</Text>

        {/* Helper text */}
        <Text style={styles.helperText}>{helperText}</Text>

        {/* Timer display */}
        <View style={styles.timerContainer}>
          <Text
            style={[
              styles.timerText,
              phaseTimer <= 5 && isRecording && styles.timerWarning,
            ]}
          >
            {isRecording ? `${phaseTimer}s` : `${MAX_PHASE_SECONDS}s`}
          </Text>
        </View>

        {/* Recording controls */}
        {!isRecording ? (
          <TouchableOpacity
            style={styles.startRecordingBtn}
            onPress={startRecording}
            activeOpacity={0.8}
          >
            <View style={styles.recordDot} />
            <Text style={styles.startRecordingText}>Start Recording</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.recordingActiveContainer}>
            <Animated.View
              style={[
                styles.recordingIndicator,
                { transform: [{ scale: pulseAnim }] },
              ]}
            />
            <Text style={styles.recordingLabel}>Recording...</Text>

            <TouchableOpacity
              style={styles.doneBtn}
              onPress={finishRecording}
              activeOpacity={0.8}
            >
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Phase progress dots */}
        <View style={styles.phaseDotsRow}>
          {PHASES.map((p, i) => (
            <View
              key={p.key}
              style={[
                styles.phaseDot,
                i <= idx
                  ? { backgroundColor: colors.primary }
                  : { backgroundColor: colors.border },
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderResult = () => {
    const totalTime = phaseDurations.reduce((a, b) => a + b, 0);
    const isNewHigh = score > highScore || (score === highScore && highScore > 0);

    return (
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <GameResultCard
          gameName={GAME_NAME}
          score={score}
          maxScore={100}
          highScore={highScore}
          isNewHighScore={isNewHigh}
          stats={[
            { label: 'Phase 1 time', value: `${phaseDurations[0]}s` },
            { label: 'Phase 2 time', value: `${phaseDurations[1]}s` },
            { label: 'Phase 3 time', value: `${phaseDurations[2]}s` },
            { label: 'Total speaking', value: `${totalTime}s` },
          ]}
          onPlayAgain={resetGame}
          onExit={() => navigation.goBack()}
        />
      </ScrollView>
    );
  };

  // ---------------------------------------------------------------------------
  // Main render
  // ---------------------------------------------------------------------------
  return (
    <ScreenContainer>
      <View style={styles.container}>
        {gameState === 'start' && renderStart()}
        {gameState === 'topic' && renderTopicReveal()}
        {gameState === 'countdown' && renderCountdown()}
        {(gameState === 'phase1' ||
          gameState === 'phase2' ||
          gameState === 'phase3') &&
          renderPhase()}
        {gameState === 'result' && renderResult()}
      </View>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },

  // Start screen
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dcfce7',
    borderWidth: 2,
    borderColor: '#86efac',
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
    color: colors.text,
  },
  description: {
    fontSize: typography.body,
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

  // Topic reveal
  topicCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  topicLabel: {
    fontSize: typography.body,
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  topicText: {
    fontSize: typography.heading,
    fontWeight: typography.weightBold,
    color: colors.text,
    textAlign: 'center',
  },

  // Countdown
  countdownNumber: {
    fontSize: 72,
    fontWeight: typography.weightBold,
    color: colors.primary,
    marginVertical: spacing.lg,
  },
  countdownSubtext: {
    fontSize: typography.subheading,
    color: colors.muted,
    textAlign: 'center',
  },

  // Phase screen
  phaseHeader: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  phaseHeaderText: {
    fontSize: typography.subheading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  topicReminder: {
    fontSize: typography.small,
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  helperText: {
    fontSize: typography.body,
    fontWeight: typography.weightSemi,
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontStyle: 'italic',
  },

  // Timer
  timerContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  timerText: {
    fontSize: 36,
    fontWeight: typography.weightBold,
    color: colors.primary,
  },
  timerWarning: {
    color: '#ef4444',
  },

  // Recording controls
  startRecordingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 30,
    gap: spacing.sm,
  },
  recordDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ffffff',
  },
  startRecordingText: {
    fontSize: typography.body,
    fontWeight: typography.weightSemi,
    color: '#ffffff',
  },
  recordingActiveContainer: {
    alignItems: 'center',
    gap: spacing.md,
  },
  recordingIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ef4444',
  },
  recordingLabel: {
    fontSize: typography.body,
    fontWeight: typography.weightSemi,
    color: '#ef4444',
  },
  doneBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: 24,
  },
  doneBtnText: {
    fontSize: typography.body,
    fontWeight: typography.weightSemi,
    color: '#ffffff',
  },

  // Phase dots
  phaseDotsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  phaseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
