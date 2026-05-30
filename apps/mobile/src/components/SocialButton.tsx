import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface SocialButtonProps {
  provider: 'apple' | 'google';
  onPress: () => void;
}

const CONFIG = {
  apple: {
    icon: 'logo-apple' as const,
    iconColor: '#1F1B16',
    label: 'Continue with Apple',
  },
  google: {
    icon: 'logo-google' as const,
    iconColor: '#4285F4',
    label: 'Continue with Google',
  },
};

export function SocialButton({ provider, onPress }: SocialButtonProps) {
  const config = CONFIG[provider];

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        <Ionicons name={config.icon} size={20} color={config.iconColor} />
        <Text style={styles.label}>{config.label}</Text>
      </View>
      <View style={styles.soonChip}>
        <Text style={styles.soonText}>Soon</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: 16,
    paddingHorizontal: spacing.md,
    minHeight: 56,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    fontSize: typography.body,
    fontFamily: typography.fontFamily.semiBold,
    fontWeight: typography.weightSemi,
    color: colors.text,
  },
  soonChip: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  soonText: {
    fontSize: typography.tiny,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.weightBold,
    color: colors.primaryDark,
  },
});
