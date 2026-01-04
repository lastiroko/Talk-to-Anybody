import { Text, View, StyleSheet } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

interface BaselineScreenProps {
  onComplete: () => void;
}

export function BaselineScreen({ onComplete }: BaselineScreenProps) {
  return (
    <ScreenContainer>
      <View style={styles.section}>
        <Text style={styles.title}>Baseline recording</Text>
        <Text style={styles.subtitle}>
          Placeholder for 60–90s recording prompt. Press finish to simulate capturing a baseline.
        </Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton title="Finish" onPress={onComplete} />
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
