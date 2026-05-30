import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface AchievementBadgeProps {
  icon: IoniconName;
  label: string;
  unlocked: boolean;
}

export function AchievementBadge({ icon, label, unlocked }: AchievementBadgeProps) {
  return (
    <View style={[styles.badge, unlocked ? styles.unlocked : styles.locked, shadows.soft]}>
      <View style={[styles.circle, unlocked ? styles.circleUnlocked : styles.circleLocked]}>
        <Ionicons
          name={unlocked ? icon : 'lock-closed'}
          size={24}
          color={unlocked ? colors.primary : colors.textMuted}
        />
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
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locked: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleUnlocked: {
    backgroundColor: colors.recordBg,
  },
  circleLocked: {
    backgroundColor: colors.border,
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
