import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { StepIndicator } from '../components/StepIndicator';
import { RecordingPanel } from '../components/RecordingPanel';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

interface BaselineScreenProps {
  onComplete: () => void;
}

const TIPS = [
  'Speak naturally \u2014 don\u2019t try to be perfect',
  'It\u2019s okay to pause or stumble',
  'This is your starting point, not your final score',
];

export function BaselineScreen({ onComplete }: BaselineScreenProps) {
  const [recordingDone, setRecordingDone] = useState(false);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <StepIndicator currentStep={3} totalSteps={3} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Let's hear your voice</Text>
          <Text style={styles.subtitle}>
            Record a 60-second speech so we can measure your starting point
          </Text>
        </View>

        {/* Recording panel */}
        <RecordingPanel
          maxDurationSec={90}
          minDurationSec={10}
          showPlayback
          showPauseResume
          promptText="Tell us about something you're passionate about \u2014 a hobby, a cause, a topic you could talk about for hours. There are no wrong answers."
          onRecordingComplete={() => setRecordingDone(true)}
          onDiscard={() => setRecordingDone(false)}
        />

        {/* Tips */}
        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>{'\ud83d\udca1'} Tips for your baseline:</Text>
          {TIPS.map((tip) => (
            <Text key={tip} style={styles.tipItem}>
              {'\u2022'} {tip}
            </Text>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {recordingDone ? (
            <PrimaryButton title="Continue \u2192" onPress={onComplete} />
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
  },
  header: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.heading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.muted,
    lineHeight: 22,
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
    fontSize: typography.body,
    fontWeight: typography.weightSemi,
    color: colors.text,
    marginBottom: 4,
  },
  tipItem: {
    fontSize: typography.small,
    color: colors.muted,
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
    fontSize: typography.body,
    color: colors.muted,
    fontWeight: typography.weightSemi,
  },
});
