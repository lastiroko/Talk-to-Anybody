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
  if (value > 70) return '#4ADE80';
  if (value >= 40) return '#FACC15';
  return '#E63946';
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
    color: '#8A8A8A',
  },
  barTrack: {
    flex: 1,
    height: 10,
    backgroundColor: '#1F1F1F',
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
