import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

interface StatCardProps {
  label: string;
  value: string;
  icon?: string;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <View style={[styles.card, shadows.card]}>
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
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
  icon: {
    fontSize: 20,
  },
  value: {
    fontSize: typography.subheading,
    fontWeight: typography.weightBold,
    color: '#FFFFFF',
  },
  label: {
    fontSize: typography.small,
    color: '#8A8A8A',
    textAlign: 'center',
  },
});
