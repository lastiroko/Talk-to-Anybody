import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { haptic } from '../utils/haptics';

type RecordingState = 'ready' | 'countdown' | 'recording' | 'done';

interface RecordButtonProps {
  maxDurationSec: number;
  onRecordingComplete: (durationSec: number) => void;
  onReRecord: () => void;
  showCountdown?: boolean;
}

function PulseRing({ delay, duration }: { delay: number; duration: number }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.8,
            duration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.4, duration: 0, useNativeDriver: true }),
        ]),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [scale, opacity, delay, duration]);

  return (
    <Animated.View
      style={[
        styles.pulseRing,
        { transform: [{ scale }], opacity },
      ]}
    />
  );
}

export function RecordButton({
  maxDurationSec,
  onRecordingComplete,
  onReRecord,
  showCountdown = false,
}: RecordButtonProps) {
  const [state, setState] = useState<RecordingState>('ready');
  const [seconds, setSeconds] = useState(0);
  const [countdownNum, setCountdownNum] = useState(3);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Recording pulse for inner circle
  const innerPulse = useRef(new Animated.Value(1)).current;
  const innerPulseAnim = useRef<Animated.CompositeAnimation | null>(null);

  // Done spring animation
  const doneScale = useRef(new Animated.Value(0.5)).current;

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // Inner circle pulse while recording
  useEffect(() => {
    if (state === 'recording') {
      innerPulseAnim.current = Animated.loop(
        Animated.sequence([
          Animated.timing(innerPulse, {
            toValue: 1.05,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(innerPulse, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );
      innerPulseAnim.current.start();
    } else {
      innerPulseAnim.current?.stop();
      innerPulse.setValue(1);
    }
    return () => {
      innerPulseAnim.current?.stop();
    };
  }, [state, innerPulse]);

  // Done spring
  useEffect(() => {
    if (state === 'done') {
      doneScale.setValue(0.5);
      Animated.spring(doneScale, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }).start();
    }
  }, [state, doneScale]);

  const startCountdown = () => {
    setState('countdown');
    setCountdownNum(3);
    let count = 3;
    intervalRef.current = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearTimer();
        startRecording();
      } else {
        setCountdownNum(count);
      }
    }, 1000);
  };

  const startRecording = () => {
    setState('recording');
    haptic.medium();
    setSeconds(0);
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev >= maxDurationSec - 1) {
          clearTimer();
          setState('done');
          haptic.success();
          onRecordingComplete(maxDurationSec);
          return maxDurationSec;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handlePress = () => {
    if (state === 'ready') {
      if (showCountdown) {
        startCountdown();
      } else {
        startRecording();
      }
    } else if (state === 'recording') {
      clearTimer();
      setState('done');
      haptic.success();
      onRecordingComplete(seconds);
    }
  };

  const handleReRecord = () => {
    clearTimer();
    setState('ready');
    setSeconds(0);
    onReRecord();
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  return (
    <View style={styles.container}>
      {/* Timer */}
      <Text style={styles.timer}>
        {formatTime(seconds)} / {formatTime(maxDurationSec)}
      </Text>

      {/* Countdown overlay */}
      {state === 'countdown' ? (
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownNumber}>{countdownNum}</Text>
          <Text style={styles.countdownLabel}>Get ready...</Text>
        </View>
      ) : state === 'ready' ? (
        <>
          <TouchableOpacity style={styles.recordButton} onPress={handlePress} activeOpacity={0.7}>
            <View style={styles.recordDot} />
          </TouchableOpacity>
          <Text style={styles.hint}>Tap to start recording</Text>
        </>
      ) : state === 'recording' ? (
        <View style={styles.pulseContainer}>
          <PulseRing delay={0} duration={1500} />
          <PulseRing delay={500} duration={1500} />
          <PulseRing delay={1000} duration={1500} />
          <TouchableOpacity style={styles.recordButtonActive} onPress={handlePress} activeOpacity={0.7}>
            <Animated.View style={[styles.stopDot, { transform: [{ scale: innerPulse }] }]} />
          </TouchableOpacity>
          <Text style={styles.hint}>Tap to stop</Text>
        </View>
      ) : (
        <>
          <Animated.View style={[styles.doneCircle, { transform: [{ scale: doneScale }] }]}>
            <Text style={styles.doneCheck}>{'\u2713'}</Text>
          </Animated.View>
          <Text style={styles.doneText}>Recording saved {'\u2713'}</Text>
          <TouchableOpacity onPress={handleReRecord} style={styles.reRecordLink}>
            <Text style={styles.reRecordText}>Re-record</Text>
          </TouchableOpacity>
        </>
      )}
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
  pulseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 160,
    height: 160,
    gap: spacing.md,
  },
  pulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#ef4444',
  },
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
  recordButtonActive: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fecaca',
    borderWidth: 3,
    borderColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  stopDot: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#ef4444',
  },
  hint: {
    fontSize: typography.small,
    color: colors.muted,
  },
  doneCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dcfce7',
    borderWidth: 3,
    borderColor: '#86efac',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneCheck: {
    fontSize: 36,
    color: '#16a34a',
    fontWeight: typography.weightBold,
  },
  doneText: {
    fontSize: typography.body,
    color: '#16a34a',
    fontWeight: typography.weightSemi,
  },
  reRecordLink: {
    paddingVertical: spacing.xs,
  },
  reRecordText: {
    fontSize: typography.body,
    color: colors.primary,
    fontWeight: typography.weightSemi,
  },
  countdownContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    gap: spacing.sm,
  },
  countdownNumber: {
    fontSize: 64,
    fontWeight: typography.weightBold,
    color: colors.primary,
  },
  countdownLabel: {
    fontSize: typography.body,
    color: colors.muted,
  },
});
