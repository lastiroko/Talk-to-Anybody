import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface MetricCardProps {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'stable';
  trendLabel?: string;
}

const TREND_CONFIG = {
  up: { arrow: '\u2191', color: '#16a34a' },
  down: { arrow: '\u2193', color: '#ef4444' },
  stable: { arrow: '\u2192', color: colors.muted },
};

export function MetricCard({ label, value, trend, trendLabel }: MetricCardProps) {
  const trendStyle = trend ? TREND_CONFIG[trend] : null;

  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {trendStyle && trendLabel ? (
        <Text style={[styles.trend, { color: trendStyle.color }]}>
          {trendStyle.arrow} {trendLabel}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  label: {
    fontSize: typography.small,
    color: colors.muted,
    textAlign: 'center',
  },
  trend: {
    fontSize: 12,
    fontWeight: typography.weightSemi,
  },
});
