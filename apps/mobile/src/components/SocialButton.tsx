import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface SocialButtonProps {
  provider: 'apple' | 'google';
  onPress: () => void;
}

const CONFIG = {
  apple: {
    emoji: '\ud83c\udf4e',
    label: 'Continue with Apple',
    bg: '#0f172a',
    textColor: '#fff',
    borderColor: '#0f172a',
  },
  google: {
    emoji: 'G',
    label: 'Continue with Google',
    bg: '#fff',
    textColor: colors.text,
    borderColor: colors.border,
  },
};

export function SocialButton({ provider, onPress }: SocialButtonProps) {
  const config = CONFIG[provider];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: config.bg,
          borderColor: config.borderColor,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.emoji, provider === 'google' && styles.googleEmoji]}>
        {config.emoji}
      </Text>
      <Text style={[styles.label, { color: config.textColor }]}>{config.label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  emoji: {
    fontSize: 18,
  },
  googleEmoji: {
    fontWeight: typography.weightBold,
    fontSize: typography.subheading,
    color: '#4285F4',
  },
  label: {
    fontSize: typography.body,
    fontWeight: typography.weightSemi,
  },
});
