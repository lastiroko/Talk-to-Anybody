import { Text, View, StyleSheet } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

interface WelcomeScreenProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function WelcomeScreen({ onLogin, onSignup }: WelcomeScreenProps) {
  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <Text style={styles.title}>Welcome to SpeakCoach</Text>
        <Text style={styles.subtitle}>
          A 60-day AI-powered public speaking plan with daily workouts, practice modes, and
          coaching.
        </Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton title="Log in" onPress={onLogin} />
        <PrimaryButton title="Create account" onPress={onSignup} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
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
