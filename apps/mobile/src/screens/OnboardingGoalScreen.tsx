import { Text, View, StyleSheet } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

interface OnboardingGoalScreenProps {
  onNext: () => void;
}

export function OnboardingGoalScreen({ onNext }: OnboardingGoalScreenProps) {
  return (
    <ScreenContainer>
      <View style={styles.section}>
        <Text style={styles.title}>Choose your goal</Text>
        <Text style={styles.subtitle}>
          Placeholder options: Public speaking, Interviews, Work meetings, Social confidence.
        </Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton title="Continue" onPress={onNext} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
    marginTop: spacing.lg,
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
  actions: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
});
