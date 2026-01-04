import { Text, View, StyleSheet } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

interface SignupScreenProps {
  onCreated: () => void;
  onBack: () => void;
}

export function SignupScreen({ onCreated, onBack }: SignupScreenProps) {
  return (
    <ScreenContainer>
      <View style={styles.section}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Placeholder signup screen. Press continue to simulate signup.</Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton title="Continue" onPress={onCreated} />
        <PrimaryButton title="Back" onPress={onBack} />
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
