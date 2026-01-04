import { Text, View, StyleSheet } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

interface OnboardingScheduleScreenProps {
  onNext: () => void;
}

export function OnboardingScheduleScreen({ onNext }: OnboardingScheduleScreenProps) {
  return (
    <ScreenContainer>
      <View style={styles.section}>
        <Text style={styles.title}>Pick your daily time</Text>
        <Text style={styles.subtitle}>Placeholder: choose 5 / 10 / 15 minutes per day.</Text>
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
  },
  actions: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
});
