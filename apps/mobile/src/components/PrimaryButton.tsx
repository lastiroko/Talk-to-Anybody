import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  leftIcon?: ReactNode;
}

export function PrimaryButton({ title, onPress, leftIcon }: PrimaryButtonProps) {
  return (
    <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]} onPress={onPress}>
      {leftIcon ? <Text style={styles.iconSlot}>{leftIcon}</Text> : null}
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  pressed: {
    backgroundColor: colors.primaryDark,
  },
  iconSlot: {
    marginRight: spacing.sm,
  },
  title: {
    color: '#fff',
    fontSize: typography.body,
    fontWeight: typography.weightSemi,
  },
});
