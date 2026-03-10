import { Alert, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

const STEPS = [
  { num: '1', icon: '\ud83c\udfb2', label: 'Get topic', desc: 'Receive a random subject' },
  { num: '2', icon: '\ud83d\udee0\ufe0f', label: 'Build ABT', desc: 'And... But... Therefore...' },
  { num: '3', icon: '\ud83c\udfa4', label: 'Deliver', desc: 'Tell your story aloud' },
];

export function ABTBuilderScreen() {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>{'\ud83d\udcd6'}</Text>
        </View>
        <Text style={styles.title}>ABT Builder</Text>
        <Text style={styles.description}>
          The And-But-Therefore framework makes any story compelling. You'll get a
          random topic and build an ABT story structure in real-time.
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
