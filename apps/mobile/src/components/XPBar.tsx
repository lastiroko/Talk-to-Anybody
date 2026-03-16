import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface XPBarProps {
  current: number;
  target: number;
  level: number;
  style?: ViewStyle;
}

export function XPBar({ current, target, level, style }: XPBarProps) {
  const progress = Math.min(1, current / target);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.level}>Level {level}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.xpText}>
        {current.toLocaleString()} / {target.toLocaleString()} XP
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  level: {
    fontSize: typography.small,
    fontWeight: typography.weightBold,
    color: colors.xp,
    minWidth: 48,
  },
  barTrack: {
    flex: 1,
    height: 10,
    backgroundColor: '#F3E8FF',
    borderRadius: 999,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.xp,
    borderRadius: 999,
  },
  xpText: {
    fontSize: typography.tiny,
    fontWeight: typography.weightSemi,
    color: colors.textMuted,
    minWidth: 80,
    textAlign: 'right',
  },
});
