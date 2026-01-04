import { Text, View, StyleSheet } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

interface LoginScreenProps {
  onAuthenticated: () => void;
  onBack: () => void;
}

export function LoginScreen({ onAuthenticated, onBack }: LoginScreenProps) {
  return (
    <ScreenContainer>
      <View style={styles.section}>
        <Text style={styles.title}>Log in</Text>
        <Text style={styles.subtitle}>Placeholder login screen. Press continue to simulate login.</Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton title="Continue" onPress={onAuthenticated} />
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
