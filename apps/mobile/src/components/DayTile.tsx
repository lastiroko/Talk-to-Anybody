import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface DayTileProps {
  dayNumber: number;
  status: 'completed' | 'current' | 'locked';
  onPress: () => void;
}

const STATUS_CONFIG = {
  completed: {
    bg: '#dcfce7',
    border: '#86efac',
    icon: '\u2713',
    iconColor: '#16a34a',
  },
  current: {
    bg: '#dbeafe',
    border: colors.primary,
    icon: '\u25b6',
    iconColor: colors.primary,
  },
  locked: {
    bg: '#f1f5f9',
    border: colors.border,
    icon: '\ud83d\udd12',
    iconColor: colors.muted,
  },
};

export function DayTile({ dayNumber, status, onPress }: DayTileProps) {
  const config = STATUS_CONFIG[status];

  return (
    <TouchableOpacity
      style={[
        styles.tile,
        { backgroundColor: config.bg, borderColor: config.border },
        status === 'current' && styles.currentHighlight,
      ]}
      onPress={onPress}
      activeOpacity={status === 'locked' ? 1 : 0.7}
    >
      <Text style={[styles.icon, { color: config.iconColor }]}>{config.icon}</Text>
      <Text style={[styles.dayNumber, status === 'locked' && styles.lockedText]}>
        {dayNumber}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    gap: 2,
    maxWidth: 80,
  },
  currentHighlight: {
    borderWidth: 2.5,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  icon: {
    fontSize: 14,
  },
  dayNumber: {
    fontSize: typography.small,
    fontWeight: typography.weightSemi,
    color: colors.text,
  },
  lockedText: {
    color: colors.muted,
  },
});
