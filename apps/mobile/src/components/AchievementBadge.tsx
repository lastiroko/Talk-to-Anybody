import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface AchievementBadgeProps {
  icon: string;
  label: string;
  unlocked: boolean;
}

export function AchievementBadge({ icon, label, unlocked }: AchievementBadgeProps) {
  return (
    <View style={[styles.badge, unlocked ? styles.unlocked : styles.locked]}>
      <Text style={styles.icon}>{unlocked ? icon : '\ud83d\udd12'}</Text>
      <Text style={[styles.label, !unlocked && styles.lockedLabel]} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 90,
    alignItems: 'center',
    borderRadius: 12,
    padding: spacing.sm,
    gap: spacing.xs,
    marginRight: spacing.sm,
  },
  unlocked: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  locked: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    fontSize: 28,
  },
  label: {
    fontSize: 11,
    fontWeight: typography.weightSemi,
    color: colors.text,
    textAlign: 'center',
  },
  lockedLabel: {
    color: colors.muted,
  },
});
