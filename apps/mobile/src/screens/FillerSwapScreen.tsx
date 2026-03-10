import { Alert, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

const STEPS = [
  { num: '1', icon: '\ud83c\udf99\ufe0f', label: 'Listen', desc: 'Hear a sentence with fillers' },
  { num: '2', icon: '\ud83d\udc46', label: 'Tap fillers', desc: 'Identify the filler words' },
  { num: '3', icon: '\u2728', label: 'Replace', desc: 'Swap with power words' },
];

export function FillerSwapScreen() {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>{'\ud83d\udd04'}</Text>
        </View>
        <Text style={styles.title}>Filler Swap</Text>
        <Text style={styles.description}>
          Words like "um", "uh", "like" weaken your message. In this game, you'll hear
          a sentence with fillers and tap to replace each one with a power word.
        </Text>

        <View style={styles.steps}>
          <Text style={styles.stepsTitle}>How it works</Text>
          {STEPS.map((step) => (
            <View key={step.num} style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{step.num}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepIcon}>{step.icon}</Text>
                <View style={styles.stepText}>
                  <Text style={styles.stepLabel}>{step.label}</Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Your best</Text>
          <Text style={styles.scoreValue}>--</Text>
        </View>

        <PrimaryButton
          title="Start Game"
          onPress={() => Alert.alert('Coming soon', 'Coming in the next update!')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.lg,
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fef3c7',
    borderWidth: 2,
    borderColor: '#fcd34d',
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
  steps: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepsTitle: {
    fontSize: typography.subheading,
    fontWeight: typography.weightBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    color: '#fff',
    fontSize: typography.small,
    fontWeight: typography.weightBold,
  },
  stepContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stepIcon: {
    fontSize: 22,
  },
  stepText: {
    flex: 1,
    gap: 2,
  },
  stepLabel: {
    fontSize: typography.body,
    fontWeight: typography.weightSemi,
    color: colors.text,
  },
  stepDesc: {
    fontSize: typography.small,
    color: colors.muted,
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
});
