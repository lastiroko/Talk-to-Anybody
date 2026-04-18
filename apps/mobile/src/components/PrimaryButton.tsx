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

const VARIANT_STYLES: Record<Variant, { bg: string; pressedBg: string; textColor: string; borderColor?: string; letterSpacing?: number; textTransform?: 'uppercase' }> = {
  primary: { bg: '#FF4500', pressedBg: '#CC3700', textColor: '#FFFFFF' },
  secondary: { bg: '#2A2A2A', pressedBg: '#333333', textColor: '#FFFFFF', borderColor: 'rgba(255,255,255,0.18)' },
  ghost: { bg: 'transparent', pressedBg: 'rgba(255,255,255,0.06)', textColor: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)', letterSpacing: 1.5, textTransform: 'uppercase' },
  danger: { bg: '#E63946', pressedBg: '#CC2F3C', textColor: '#FFFFFF' },
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
          v.borderColor ? { borderWidth: 1.5, borderColor: v.borderColor } : undefined,
          variant === 'primary' && shadows.card,
          disabled && styles.disabled,
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        {leftIcon ? <View style={styles.iconSlot}>{leftIcon}</View> : null}
        <Text style={[styles.title, { color: disabled ? '#4A4A4A' : v.textColor }, v.letterSpacing ? { letterSpacing: v.letterSpacing } : undefined, v.textTransform ? { textTransform: v.textTransform } : undefined]}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    height: 52,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabled: {
    backgroundColor: '#1F1F1F',
    opacity: 0.7,
  },
  iconSlot: {
    marginRight: spacing.sm,
  },
  title: {
    fontSize: 13,
    fontFamily: typography.fontFamily.semiBold,
    fontWeight: typography.weightSemi,
  },
});
