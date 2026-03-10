import { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface SelectableCardProps {
  selected: boolean;
  onPress: () => void;
  children: ReactNode;
}

export function SelectableCard({ selected, onPress, children }: SelectableCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected ? styles.selected : styles.unselected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1.5,
    padding: spacing.md,
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: '#eff6ff',
  },
  unselected: {
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
});
