import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { GradientOrb } from '../components/Decorative';
import { useEntryAnimation } from '../hooks/useEntryAnimation';
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
  const { fadeIn } = useEntryAnimation(4);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Hero section */}
        <View style={styles.hero}>
          {/* Visual element */}
          <Animated.View style={[styles.micCircleWrap, fadeIn(0)]}>
            <GradientOrb size={200} color={colors.primary} style={{ top: -50, right: -60 }} />
            <View style={styles.micCircle}>
              <Text style={styles.micEmoji}>{'\ud83c\udf99\ufe0f'}</Text>
            </View>
          </Animated.View>

          <Animated.View style={fadeIn(1)}>
            <Text style={styles.appName}>SpeakCoach</Text>
            <Text style={styles.tagline}>Find your voice in 60 days</Text>
          </Animated.View>

          <Animated.View style={[styles.benefits, fadeIn(2)]}>
            {BENEFITS.map((benefit) => (
              <View key={benefit} style={styles.benefitPill}>
                <Text style={styles.benefitText}>{benefit}</Text>
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
    gap: spacing.md,
    paddingTop: spacing.xl,
  },
  micCircleWrap: {
    marginBottom: spacing.md,
    overflow: 'visible',
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
  },
  micEmoji: {
    fontSize: 44,
  },
  appName: {
    fontSize: 36,
    fontWeight: typography.weightBold,
    color: colors.text,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  tagline: {
    fontSize: typography.subheading,
    color: colors.muted,
    marginBottom: spacing.lg,
    textAlign: 'center',
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
