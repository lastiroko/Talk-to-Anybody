import { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { shadows } from '../theme/shadows';

interface SelectableCardProps {
  selected: boolean;
  onPress: () => void;
  children: ReactNode;
}

export function SelectableCard({ selected, onPress, children }: SelectableCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        selected ? styles.selected : styles.unselected,
        !selected && shadows.soft,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: spacing.md,
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceHighlight,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 3,
  },
  unselected: {
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
});
