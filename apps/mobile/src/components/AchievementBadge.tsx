import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

interface AchievementBadgeProps {
  icon: string;
  label: string;
  unlocked: boolean;
}

export function AchievementBadge({ icon, label, unlocked }: AchievementBadgeProps) {
  return (
    <View style={[styles.badge, unlocked ? styles.unlocked : styles.locked, shadows.soft]}>
      <View style={[styles.circle, unlocked ? styles.circleUnlocked : styles.circleLocked]}>
        <Text style={styles.icon}>{unlocked ? icon : '\ud83d\udd12'}</Text>
      </View>
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
    borderRadius: 14,
    padding: spacing.sm,
    gap: spacing.xs,
    marginRight: spacing.sm,
  },
  unlocked: {
    backgroundColor: colors.surfaceHighlight,
  },
  locked: {
    backgroundColor: colors.surfaceMuted,
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleUnlocked: {
    backgroundColor: colors.goldLight,
  },
  circleLocked: {
    backgroundColor: colors.border,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: typography.tiny,
    fontWeight: typography.weightSemi,
    color: colors.text,
    textAlign: 'center',
  },
  lockedLabel: {
    color: colors.textMuted,
  },
});
