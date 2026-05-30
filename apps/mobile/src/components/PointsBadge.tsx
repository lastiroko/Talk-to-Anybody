import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface PointsBadgeProps {
  gems: number;
  coins: number;
  style?: ViewStyle;
}

export function PointsBadge({ gems, coins, style }: PointsBadgeProps) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.pill}>
        <Ionicons name="diamond" size={12} color={colors.gem} />
        <Text style={styles.text}>+{gems.toLocaleString()}</Text>
      </View>
      <View style={styles.pill}>
        <Ionicons name="ellipse" size={12} color={colors.coin} />
        <Text style={styles.text}>+{coins.toLocaleString()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 6,
  },
  text: {
    fontSize: typography.caption,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
});
