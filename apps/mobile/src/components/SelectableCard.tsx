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
    borderColor: '#FF7A1A',
    backgroundColor: 'rgba(255,69,0,0.08)',
  },
  unselected: {
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#141414',
  },
});
