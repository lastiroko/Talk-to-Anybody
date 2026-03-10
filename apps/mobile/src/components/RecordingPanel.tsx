import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRecording } from '../hooks/useRecording';
import { ProgressBar } from './ProgressBar';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface RecordingPanelProps {
  maxDurationSec: number;
  minDurationSec?: number;
  showPlayback?: boolean;
  showPauseResume?: boolean;
  onRecordingComplete: (uri: string, durationSec: number) => void;
  onDiscard?: () => void;
  promptText?: string;
  countdownSeconds?: number;
}

const NUM_BARS = 7;
const BAR_MIN = 5;
const BAR_MAX = 40;

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export function RecordingPanel({
  maxDurationSec,
  minDurationSec = 5,
  showPlayback = true,
  showPauseResume = true,
  onRecordingComplete,
  onDiscard,
  promptText,
  countdownSeconds,
}: RecordingPanelProps) {
  const {
    status,
    durationSec,
    recordingUri,
    error,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    playRecording,
    stopPlayback,
    resetRecording,
  } = useRecording({
    maxDurationSec,
  });

  // Countdown state
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pulse animation for record button
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  // Waveform bar animations
  const barAnims = useRef(Array.from({ length: NUM_BARS }, () => new Animated.Value(BAR_MIN))).current;
  const barLoopsRef = useRef<Animated.CompositeAnimation[]>([]);

  // Start pulse
  useEffect(() => {
    if (status === 'recording') {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.1, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1.0, duration: 500, useNativeDriver: true }),
        ]),
      );
      pulseLoopRef.current = loop;
      loop.start();
    } else {
      pulseLoopRef.current?.stop();
      pulseAnim.setValue(1);
    }
  }, [status, pulseAnim]);

  // Waveform bars
  useEffect(() => {
    if (status === 'recording') {
      barLoopsRef.current = barAnims.map((anim) => {
        const duration = 200 + Math.random() * 300;
        const loop = Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: BAR_MIN + Math.random() * (BAR_MAX - BAR_MIN),
              duration,
              useNativeDriver: false,
            }),
            Animated.timing(anim, {
              toValue: BAR_MIN + Math.random() * (BAR_MAX - BAR_MIN),
              duration: 200 + Math.random() * 300,
              useNativeDriver: false,
            }),
          ]),
        );
        loop.start();
        return loop;
      });
    } else {
      barLoopsRef.current.forEach((loop) => loop.stop());
      barAnims.forEach((anim) => {
        Animated.timing(anim, { toValue: BAR_MIN, duration: 200, useNativeDriver: false }).start();
      });
    }

    return () => {
      barLoopsRef.current.forEach((loop) => loop.stop());
    };
  }, [status, barAnims]);

  // Cleanup countdown on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const handleStart = async () => {
    if (countdownSeconds && countdownSeconds > 0) {
      setCountdown(countdownSeconds);
      let count = countdownSeconds;
      countdownRef.current = setInterval(() => {
        count -= 1;
        if (count <= 0) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          setCountdown(null);
          startRecording();
        } else {
          setCountdown(count);
        }
      }, 1000);
    } else {
      await startRecording();
    }
  };

  const handleUse = () => {
    if (recordingUri) {
      onRecordingComplete(recordingUri, Math.round(durationSec));
    }
  };

  const handleDiscard = () => {
    resetRecording();
    onDiscard?.();
  };

  const handleReRecord = () => {
    resetRecording();
  };

  const handleRetry = () => {
    resetRecording();
  };

  const canUse = durationSec >= minDurationSec;

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Countdown state
  if (countdown !== null) {
    return (
      <View style={styles.container}>
        <Text style={styles.countdownNumber}>{countdown}</Text>
        <Text style={styles.countdownLabel}>Get ready...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Prompt text */}
      {promptText && (status === 'ready' || status === 'idle') ? (
        <View style={styles.promptCard}>
          <Text style={styles.promptText}>{promptText}</Text>
        </View>
      ) : null}

      {/* Timer */}
      <Text style={styles.timer}>
        {formatTime(durationSec)} / {formatTime(maxDurationSec)}
      </Text>

      {/* Waveform bars (visible during recording/paused) */}
      {(status === 'recording' || status === 'paused') ? (
        <View style={styles.waveformRow}>
          {barAnims.map((anim, i) => (
            <Animated.View
              key={i}
              style={[
                styles.waveformBar,
                { height: anim },
              ]}
            />
          ))}
        </View>
      ) : null}

      {/* Ready state */}
      {(status === 'ready' || status === 'idle') ? (
        <>
          <TouchableOpacity style={styles.recordButton} onPress={handleStart} activeOpacity={0.7}>
            <View style={styles.recordDot} />
          </TouchableOpacity>
          <Text style={styles.hint}>Tap to start recording</Text>
          <Text style={styles.maxDuration}>Max: {formatTime(maxDurationSec)}</Text>
        </>
      ) : null}

      {/* Recording state */}
      {status === 'recording' ? (
        <View style={styles.controlsRow}>
          {showPauseResume ? (
            <TouchableOpacity style={styles.controlButton} onPress={pauseRecording} activeOpacity={0.7}>
              <Text style={styles.controlIcon}>{'\u23f8\ufe0f'}</Text>
              <Text style={styles.controlLabel}>Pause</Text>
            </TouchableOpacity>
          ) : null}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity style={styles.stopButton} onPress={stopRecording} activeOpacity={0.7}>
              <View style={styles.stopSquare} />
            </TouchableOpacity>
          </Animated.View>
          {showPauseResume ? <View style={styles.controlSpacer} /> : null}
        </View>
      ) : null}

      {/* Paused state */}
      {status === 'paused' ? (
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.controlButton} onPress={resumeRecording} activeOpacity={0.7}>
            <Text style={styles.controlIcon}>{'\u25b6\ufe0f'}</Text>
            <Text style={styles.controlLabel}>Resume</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stopButton} onPress={stopRecording} activeOpacity={0.7}>
            <View style={styles.stopSquare} />
          </TouchableOpacity>
          <View style={styles.controlSpacer} />
        </View>
      ) : null}

      {/* Stopped/Done state */}
      {status === 'stopped' ? (
        <View style={styles.doneSection}>
          <View style={styles.doneCircle}>
            <Text style={styles.doneCheck}>{'\u2713'}</Text>
          </View>
          <Text style={styles.doneText}>Recorded: {formatTime(durationSec)}</Text>

          {/* Playback */}
          {showPlayback && recordingUri ? (
            <TouchableOpacity style={styles.playbackButton} onPress={playRecording} activeOpacity={0.7}>
              <Text style={styles.playbackText}>{'\u25b6'} Play recording</Text>
            </TouchableOpacity>
          ) : null}

          {/* Action buttons */}
          <TouchableOpacity
            style={[styles.useButton, !canUse && styles.useButtonDisabled]}
            onPress={handleUse}
            disabled={!canUse}
            activeOpacity={0.7}
          >
            <Text style={styles.useButtonText}>{'\u2705'} Use this recording</Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity onPress={handleReRecord} style={styles.secondaryLink}>
              <Text style={styles.secondaryText}>{'\ud83d\udd04'} Re-record</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDiscard} style={styles.secondaryLink}>
              <Text style={styles.discardText}>{'\ud83d\uddd1\ufe0f'} Discard</Text>
            </TouchableOpacity>
          </View>

          {!canUse ? (
            <Text style={styles.minWarning}>
              Minimum {minDurationSec}s required ({Math.round(durationSec)}s recorded)
            </Text>
          ) : null}
        </View>
      ) : null}

      {/* Playing state */}
      {status === 'playing' ? (
        <View style={styles.doneSection}>
          <TouchableOpacity style={styles.playbackButton} onPress={stopPlayback} activeOpacity={0.7}>
            <Text style={styles.playbackText}>{'\u23f9'} Stop playback</Text>
          </TouchableOpacity>
          <Text style={styles.hint}>Playing...</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  timer: {
    fontSize: 28,
    fontWeight: typography.weightBold,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  hint: {
    fontSize: typography.small,
    color: colors.muted,
  },
  maxDuration: {
    fontSize: 12,
    color: colors.muted,
  },

  // Prompt
  promptCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#fcd34d',
    width: '100%',
  },
  promptText: {
    fontSize: typography.body,
    color: colors.text,
    lineHeight: 22,
    textAlign: 'center',
  },

  // Record button
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fee2e2',
    borderWidth: 3,
    borderColor: '#fca5a5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ef4444',
  },

  // Stop button
  stopButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fecaca',
    borderWidth: 3,
    borderColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopSquare: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },

  // Controls row
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  controlButton: {
    alignItems: 'center',
    gap: 4,
    width: 60,
  },
  controlIcon: {
    fontSize: 28,
  },
  controlLabel: {
    fontSize: 12,
    color: colors.muted,
  },
  controlSpacer: {
    width: 60,
  },

  // Waveform
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
    height: 45,
  },
  waveformBar: {
    width: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
  },

  // Done section
  doneSection: {
    alignItems: 'center',
    gap: spacing.md,
    width: '100%',
  },
  doneCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#dcfce7',
    borderWidth: 3,
    borderColor: '#86efac',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneCheck: {
    fontSize: 32,
    color: '#16a34a',
    fontWeight: typography.weightBold,
  },
  doneText: {
    fontSize: typography.body,
    color: '#16a34a',
    fontWeight: typography.weightSemi,
  },

  // Playback
  playbackButton: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
  },
  playbackText: {
    fontSize: typography.body,
    fontWeight: typography.weightSemi,
    color: colors.text,
  },

  // Use button
  useButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  useButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  useButtonText: {
    color: '#fff',
    fontSize: typography.body,
    fontWeight: typography.weightSemi,
  },

  // Secondary actions
  secondaryActions: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  secondaryLink: {
    paddingVertical: spacing.xs,
  },
  secondaryText: {
    fontSize: typography.body,
    color: colors.primary,
    fontWeight: typography.weightSemi,
  },
  discardText: {
    fontSize: typography.body,
    color: colors.muted,
    fontWeight: typography.weightSemi,
  },

  minWarning: {
    fontSize: typography.small,
    color: '#f59e0b',
  },

  // Countdown
  countdownNumber: {
    fontSize: 64,
    fontWeight: typography.weightBold,
    color: colors.primary,
  },
  countdownLabel: {
    fontSize: typography.body,
    color: colors.muted,
  },

  // Error
  errorText: {
    fontSize: typography.body,
    color: '#ef4444',
    textAlign: 'center',
  },
  retryButton: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  retryText: {
    fontSize: typography.body,
    color: colors.primary,
    fontWeight: typography.weightSemi,
  },
});
