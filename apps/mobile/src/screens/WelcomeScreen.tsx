import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

interface WelcomeScreenProps {
  onLogin: () => void;
  onSignup: () => void;
}

const BENEFITS = [
  '\ud83d\udcca AI-powered feedback on every session',
  '\ud83e\udde0 Psychology-backed learning system',
  '\ud83c\udfaf Personalized 60-day plan',
];

export function WelcomeScreen({ onLogin, onSignup }: WelcomeScreenProps) {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Hero section */}
        <View style={styles.hero}>
          {/* Visual element */}
          <View style={styles.micCircle}>
            <Text style={styles.micEmoji}>{'\ud83c\udf99\ufe0f'}</Text>
          </View>

          <Text style={styles.appName}>SpeakCoach</Text>
          <Text style={styles.tagline}>Find your voice in 60 days</Text>

          <View style={styles.benefits}>
            {BENEFITS.map((benefit) => (
              <View key={benefit} style={styles.benefitPill}>
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action section */}
        <View style={styles.actions}>
          <PrimaryButton title="Get Started" onPress={onSignup} />

          <TouchableOpacity onPress={onLogin} style={styles.loginLink}>
            <Text style={styles.loginLinkText}>I already have an account</Text>
          </TouchableOpacity>

          <Text style={styles.legal}>
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingTop: spacing.xl,
  },
  micCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eff6ff',
    borderWidth: 3,
    borderColor: '#bfdbfe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  micEmoji: {
    fontSize: 44,
  },
  appName: {
    fontSize: 36,
    fontWeight: typography.weightBold,
    color: colors.text,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: typography.subheading,
    color: colors.muted,
    marginBottom: spacing.lg,
  },
  benefits: {
    gap: spacing.sm,
    width: '100%',
  },
  benefitPill: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  benefitText: {
    fontSize: typography.body,
    color: colors.text,
    textAlign: 'center',
  },
  actions: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
    paddingTop: spacing.xl,
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  loginLinkText: {
    fontSize: typography.body,
    color: colors.primary,
    fontWeight: typography.weightSemi,
  },
  legal: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
