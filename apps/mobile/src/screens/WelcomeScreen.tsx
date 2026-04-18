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
        {/* Radial glow at bottom */}
        <View style={styles.glowWrap}>
          <View style={styles.glow} />
        </View>

        {/* Hero section */}
        <View style={styles.hero}>
          <Animated.View style={fadeIn(0)}>
            <Text style={styles.caption}>TALK / TO / ANYBODY</Text>
          </Animated.View>

          <Animated.View style={fadeIn(1)}>
            <Text style={styles.displayText}>
              FIND{' '}
              <Text style={styles.displayHighlight}>YOUR</Text>
              {'\n'}VOICE.
            </Text>
          </Animated.View>

          <Animated.View style={fadeIn(2)}>
            <Text style={styles.subtitle}>
              Practice talking to anybody — tough bosses, crushes, strangers, crowds.
            </Text>
          </Animated.View>
        </View>

        {/* Action section */}
        <Animated.View style={[styles.actions, fadeIn(3)]}>
          <PrimaryButton title="START TRAINING" onPress={onSignup} />

          <TouchableOpacity onPress={onLogin} style={styles.loginLink}>
            <Text style={styles.loginLinkText}>
              ALREADY A MEMBER?{' '}
              <Text style={styles.loginLinkAccent}>LOG IN</Text>
            </Text>
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
    backgroundColor: colors.background,
  },
  glowWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 320,
    overflow: 'hidden',
  },
  glow: {
    flex: 1,
    borderRadius: 160,
    backgroundColor: 'rgba(255,91,10,0.25)',
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
    paddingTop: spacing.xxxl,
  },
  caption: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.caption,
    letterSpacing: 4,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  displayText: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.hero,
    lineHeight: 68,
    color: colors.text,
    letterSpacing: -1,
  },
  displayHighlight: {
    fontFamily: typography.fontFamily.display,
    color: colors.primaryLight,
    fontStyle: 'italic',
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.body,
    color: colors.textMuted,
    lineHeight: 22,
    maxWidth: 320,
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
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.small,
    letterSpacing: 2,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  loginLinkAccent: {
    color: colors.primary,
    fontFamily: typography.fontFamily.semiBold,
  },
  legal: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.tiny,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 16,
  },
});
