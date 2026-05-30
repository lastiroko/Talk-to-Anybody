import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface DayTileProps {
  dayNumber: number;
  status: 'completed' | 'current' | 'locked';
  onPress: () => void;
}

interface StatusStyle {
  bg: string;
  icon: IoniconName;
  iconColor: string;
  textColor: string;
}

const STATUS_CONFIG: Record<DayTileProps['status'], StatusStyle> = {
  completed: {
    bg: colors.mint,
    icon: 'checkmark',
    iconColor: colors.textOnPrimary,
    textColor: colors.textOnPrimary,
  },
  current: {
    bg: colors.primary,
    icon: 'play',
    iconColor: colors.textOnPrimary,
    textColor: colors.textOnPrimary,
  },
  locked: {
    bg: colors.surface,
    icon: 'lock-closed',
    iconColor: colors.textMuted,
    textColor: colors.textMuted,
  },
};

export function DayTile({ dayNumber, status, onPress }: DayTileProps) {
  const config = STATUS_CONFIG[status];

  return (
    <TouchableOpacity
      style={[
        styles.tile,
        { backgroundColor: config.bg },
        status === 'locked' && styles.lockedBorder,
        status !== 'locked' && shadows.soft,
        status === 'current' && styles.currentBloom,
      ]}
      onPress={onPress}
      activeOpacity={status === 'locked' ? 1 : 0.7}
    >
      <Ionicons name={config.icon} size={14} color={config.iconColor} />
      <Text style={[styles.dayNumber, { color: config.textColor }]}>
        {dayNumber}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    gap: 2,
    maxWidth: 80,
  },
  lockedBorder: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  currentBloom: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 4,
  },
  dayNumber: {
    fontSize: typography.small,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.weightBold,
  },
});
