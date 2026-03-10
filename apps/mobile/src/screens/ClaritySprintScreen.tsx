import { Alert, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

const STEPS = [
  { num: '1', icon: '\ud83e\udde0', label: 'Read concept', desc: 'Get a technical idea' },
  { num: '2', icon: '\ud83d\udca1', label: 'Simplify', desc: 'Break it down for a 10-year-old' },
  { num: '3', icon: '\u23f1\ufe0f', label: '30-second sprint', desc: 'Explain it before time runs out' },
];

export function ClaritySprintScreen() {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>{'\ud83d\udc8e'}</Text>
        </View>
        <Text style={styles.title}>Clarity Sprint</Text>
        <Text style={styles.description}>
          Can you explain a complex idea in simple words? You'll get a technical
          concept and have 30 seconds to explain it so a 10-year-old would understand.
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
    backgroundColor: '#f3e8ff',
    borderWidth: 2,
    borderColor: '#c4b5fd',
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
