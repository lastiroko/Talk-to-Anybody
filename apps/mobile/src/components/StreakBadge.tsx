import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface StreakBadgeProps {
  count: number;
  style?: ViewStyle;
}

export function StreakBadge({ count, style }: StreakBadgeProps) {
  return (
    <View style={[styles.pill, style]}>
      <Ionicons name="flame" size={14} color={colors.textOnPrimary} />
      <Text style={styles.count}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  count: {
    fontSize: typography.caption,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.weightBold,
    color: colors.textOnPrimary,
  },
});
