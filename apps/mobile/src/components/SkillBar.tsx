import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface SkillBarProps {
  label: string;
  value: number;
  maxValue?: number;
}

function getBarColor(value: number): string {
  if (value > 70) return '#16a34a';
  if (value >= 40) return '#eab308';
  return '#ef4444';
}

export function SkillBar({ label, value, maxValue = 100 }: SkillBarProps) {
  const pct = Math.min(100, Math.max(0, (value / maxValue) * 100));
  const barColor = getBarColor(value);

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: barColor }]} />
      </View>
      <Text style={[styles.score, { color: barColor }]}>{Math.round(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    width: 80,
    fontSize: typography.small,
    color: colors.muted,
  },
  barTrack: {
    flex: 1,
    height: 10,
    backgroundColor: colors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  score: {
    width: 30,
    fontSize: typography.small,
    fontWeight: typography.weightBold,
    textAlign: 'right',
  },
});
