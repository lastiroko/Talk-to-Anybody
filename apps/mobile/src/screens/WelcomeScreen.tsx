import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { useEntryAnimation } from '../hooks/useEntryAnimation';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

interface WelcomeScreenProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function WelcomeScreen({ onLogin, onSignup }: WelcomeScreenProps) {
  const { fadeIn } = useEntryAnimation(4);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Soft peach blob upper-left */}
        <View style={[styles.blob, styles.blobPeach]} />
        {/* Soft butter blob upper-right */}
        <View style={[styles.blob, styles.blobButter]} />

        {/* Hero section */}
        <View style={styles.hero}>
          <Animated.View style={fadeIn(0)}>
            <Text style={styles.eyebrow}>Talk to anybody</Text>
          </Animated.View>

          <Animated.View style={fadeIn(1)}>
            <Text style={styles.displayText}>
              Find your voice.
            </Text>
            {/* Hand-drawn underline */}
            <View style={styles.squiggleUnderline} />
          </Animated.View>

          <Animated.View style={fadeIn(2)}>
            <Text style={styles.subtitle}>
              Practice talking to anybody — bosses, crushes, strangers, crowds. 5 minutes a day.
            </Text>
          </Animated.View>
        </View>

        {/* Action section */}
        <Animated.View style={[styles.actions, fadeIn(3)]}>
          <PrimaryButton title="Start training" onPress={onSignup} />

          <TouchableOpacity onPress={onLogin} style={styles.loginLink}>
            <Text style={styles.loginLinkText}>
              Already have an account?{' '}
              <Text style={styles.loginLinkAccent}>Log in</Text>
            </Text>
          </TouchableOpacity>

          <Text style={styles.legal}>
            By continuing, you agree to our Terms & Privacy Policy.
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
    backgroundColor: colors.background,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.55,
  },
  blobPeach: {
    top: -80,
    left: -100,
    width: 320,
    height: 320,
    backgroundColor: colors.peach,
  },
  blobButter: {
    top: -40,
    right: -80,
    width: 240,
    height: 240,
    backgroundColor: colors.butter,
    opacity: 0.30,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
    paddingTop: spacing.xxxl,
  },
  eyebrow: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 13,
    letterSpacing: 0.6,
    color: colors.primary,
  },
  displayText: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.hero,
    lineHeight: 60,
    color: colors.text,
    letterSpacing: -0.5,
    fontWeight: typography.weightSemi,
  },
  squiggleUnderline: {
    width: 100,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginLeft: 4,
    transform: [{ rotate: '-0.5deg' }],
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    maxWidth: 340,
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
    fontFamily: typography.fontFamily.medium,
    fontSize: 15,
    color: colors.textSecondary,
  },
  loginLinkAccent: {
    color: colors.primary,
    fontFamily: typography.fontFamily.bold,
  },
  legal: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
