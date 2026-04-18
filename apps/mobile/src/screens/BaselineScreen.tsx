import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { StepIndicator } from '../components/StepIndicator';
import { RecordingPanel } from '../components/RecordingPanel';
import { GradientOrb } from '../components/Decorative';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

interface BaselineScreenProps {
  onComplete: () => void;
}

const TIPS = [
  'Speak naturally \u2014 don\u2019t perform',
  'Pauses and stumbles are fine',
  'This is your baseline, not your ceiling',
];

export function BaselineScreen({ onComplete }: BaselineScreenProps) {
  const [recordingDone, setRecordingDone] = useState(false);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <StepIndicator currentStep={3} totalSteps={3} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Record your baseline</Text>
          <Text style={styles.subtitle}>
            60 seconds so we can measure where you start
          </Text>
        </View>

        {/* Recording panel with decorative orb */}
        <View style={styles.recordingWrap}>
          <GradientOrb size={180} color={colors.primary} style={{ top: -40, alignSelf: 'center' }} />
          <RecordingPanel
            maxDurationSec={90}
            minDurationSec={10}
            showPlayback
            showPauseResume
            promptText="Tell us about something you're passionate about \u2014 a hobby, a cause, a topic you could talk about for hours. There are no wrong answers."
            onRecordingComplete={() => setRecordingDone(true)}
            onDiscard={() => setRecordingDone(false)}
          />
        </View>

        {/* Tips */}
        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>TIPS</Text>
          {TIPS.map((tip) => (
            <Text key={tip} style={styles.tipItem}>
              {'\u2022'} {tip}
            </Text>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {recordingDone ? (
            <PrimaryButton title="Continue" onPress={onComplete} />
          ) : (
            <TouchableOpacity onPress={onComplete} style={styles.skipLink}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.heading,
    color: colors.text,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.body,
    color: colors.textMuted,
    lineHeight: 22,
  },
  recordingWrap: {
    position: 'relative',
  },
  tips: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  tipsTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.caption,
    letterSpacing: 2,
    color: colors.textMuted,
    marginBottom: 4,
  },
  tipItem: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.small,
    color: colors.textMuted,
    lineHeight: 20,
    paddingLeft: spacing.sm,
  },
  actions: {
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  skipLink: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  skipText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.body,
    color: colors.textMuted,
  },
});
