import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

interface DayTileProps {
  dayNumber: number;
  status: 'completed' | 'current' | 'locked';
  onPress: () => void;
}

const STATUS_CONFIG = {
  completed: {
    bg: '#1F1F1F',
    icon: '\u2713',
    iconColor: '#FF4500',
  },
  current: {
    bg: '#1F1F1F',
    icon: '\u25b6',
    iconColor: '#FF7A1A',
  },
  locked: {
    bg: '#1F1F1F',
    icon: '\ud83d\udd12',
    iconColor: '#4A4A4A',
  },
};

export function DayTile({ dayNumber, status, onPress }: DayTileProps) {
  const config = STATUS_CONFIG[status];

  return (
    <TouchableOpacity
      style={[
        styles.tile,
        { backgroundColor: config.bg },
        status === 'completed' && styles.completedTile,
        status === 'current' && styles.currentHighlight,
        status === 'locked' && styles.lockedTile,
        shadows.soft,
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
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    gap: 2,
    maxWidth: 80,
  },
  completedTile: {
    borderWidth: 1,
    borderColor: 'rgba(255,69,0,0.3)',
  },
  lockedTile: {
    borderWidth: 1,
    borderColor: '#4A4A4A',
    borderStyle: 'dashed',
  },
  currentHighlight: {
    borderWidth: 2.5,
    borderColor: '#FF7A1A',
    shadowColor: '#FF7A1A',
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
    color: '#FFFFFF',
  },
  lockedText: {
    color: '#4A4A4A',
  },
});
