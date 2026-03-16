import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { useEntryAnimation } from '../hooks/useEntryAnimation';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';

interface WelcomeScreenProps {
  onLogin: () => void;
  onSignup: () => void;
}

const BENEFITS = [
  { icon: '\ud83d\udcca', text: 'AI-powered feedback on every session' },
  { icon: '\ud83e\udde0', text: 'Psychology-backed learning system' },
  { icon: '\ud83c\udfaf', text: 'Personalized 60-day plan' },
];

export function WelcomeScreen({ onLogin, onSignup }: WelcomeScreenProps) {
  const { fadeIn } = useEntryAnimation(4);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Hero section */}
        <View style={styles.hero}>
          <Animated.View style={[styles.logoCircle, fadeIn(0)]}>
            <Text style={styles.logoEmoji}>{'\ud83c\udf99\ufe0f'}</Text>
          </Animated.View>

          <Animated.View style={fadeIn(1)}>
            <Text style={styles.appName}>SpeakCoach</Text>
            <Text style={styles.tagline}>Find your voice in 60 days</Text>
          </Animated.View>

          <Animated.View style={[styles.benefits, fadeIn(2)]}>
            {BENEFITS.map((b) => (
              <View key={b.text} style={[styles.benefitCard, shadows.card]}>
                <View style={styles.benefitIconCircle}>
                  <Text style={styles.benefitIcon}>{b.icon}</Text>
                </View>
                <Text style={styles.benefitText}>{b.text}</Text>
              </View>
            ))}
          </Animated.View>
        </View>

        {/* Action section */}
        <Animated.View style={[styles.actions, fadeIn(3)]}>
          <PrimaryButton title="Get Started" onPress={onSignup} />

          <TouchableOpacity onPress={onLogin} style={styles.loginLink}>
            <Text style={styles.loginLinkText}>I already have an account</Text>
          </TouchableOpacity>

          <Text style={styles.legal}>
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
        </Animated.View>
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
    gap: spacing.lg,
    paddingTop: spacing.xl,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  logoEmoji: { fontSize: 44 },
  appName: {
    fontSize: typography.hero,
    fontWeight: typography.weightBold,
    color: colors.text,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  tagline: {
    fontSize: typography.subheading,
    color: colors.textMuted,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  benefits: {
    gap: spacing.sm,
    width: '100%',
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    gap: spacing.md,
  },
  benefitIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitIcon: { fontSize: 20 },
  benefitText: {
    flex: 1,
    fontSize: typography.body,
    color: colors.text,
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
    fontSize: typography.tiny,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
