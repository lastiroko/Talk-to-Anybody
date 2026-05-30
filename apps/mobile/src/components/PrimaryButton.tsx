import { ReactNode, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { haptic } from '../utils/haptics';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  leftIcon?: ReactNode;
  disabled?: boolean;
  variant?: Variant;
}

interface VariantStyle {
  bg: string;
  pressedBg: string;
  textColor: string;
  borderColor?: string;
  borderWidth?: number;
}

const VARIANT_STYLES: Record<Variant, VariantStyle> = {
  primary: {
    bg: colors.primary,
    pressedBg: colors.primaryDark,
    textColor: colors.textOnPrimary,
  },
  secondary: {
    bg: colors.surface,
    pressedBg: colors.surfaceMuted,
    textColor: colors.primary,
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  ghost: {
    bg: 'transparent',
    pressedBg: colors.surfaceMuted,
    textColor: colors.primary,
  },
  danger: {
    bg: colors.surface,
    pressedBg: colors.errorBg,
    textColor: colors.error,
    borderColor: colors.error,
    borderWidth: 1.5,
  },
};

export function PrimaryButton({ title, onPress, leftIcon, disabled = false, variant = 'primary' }: PrimaryButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const v = VARIANT_STYLES[variant];

  const handlePressIn = () => {
    if (disabled) return;
    Animated.timing(scale, {
      toValue: 0.97,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    haptic.light();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: pressed && !disabled ? v.pressedBg : v.bg },
          v.borderColor ? { borderWidth: v.borderWidth ?? 1.5, borderColor: v.borderColor } : undefined,
          variant === 'primary' && !disabled && shadows.bloom,
          disabled && styles.disabled,
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        {leftIcon ? <View style={styles.iconSlot}>{leftIcon}</View> : null}
        <Text
          style={[
            styles.title,
            { color: disabled ? colors.textMuted : v.textColor },
          ]}
        >
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    height: 58,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabled: {
    backgroundColor: colors.surfaceMuted,
    opacity: 0.7,
  },
  iconSlot: {
    marginRight: spacing.sm,
  },
  title: {
    fontSize: typography.subheading,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.weightBold,
  },
});
