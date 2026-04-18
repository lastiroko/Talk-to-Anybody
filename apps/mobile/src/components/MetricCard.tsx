import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

interface MetricCardProps {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'stable';
  trendLabel?: string;
}

const TREND_CONFIG = {
  up: { arrow: '\u2191', color: '#4ADE80' },
  down: { arrow: '\u2193', color: '#E63946' },
  stable: { arrow: '\u2192', color: '#8A8A8A' },
};

export function MetricCard({ label, value, trend, trendLabel }: MetricCardProps) {
  const trendStyle = trend ? TREND_CONFIG[trend] : null;

  return (
    <View style={[styles.card, shadows.card]}>
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
    backgroundColor: '#141414',
    borderRadius: 14,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  value: {
    fontSize: 22,
    fontWeight: typography.weightBold,
    color: '#FFFFFF',
  },
  label: {
    fontSize: typography.small,
    color: '#8A8A8A',
    textAlign: 'center',
  },
  trend: {
    fontSize: typography.tiny,
    fontWeight: typography.weightSemi,
  },
});
