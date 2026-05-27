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
        <Text style={styles.gemText}>{gems.toLocaleString()}</Text>
      </View>
      <View style={styles.pill}>
        <Ionicons name="ellipse" size={12} color={colors.coin} />
        <Text style={styles.coinText}>{coins.toLocaleString()}</Text>
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
    backgroundColor: '#1F1F1F',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
  },
  gemText: {
    fontSize: typography.caption,
    fontWeight: typography.weightBold,
    color: '#FF4500',
  },
  coinText: {
    fontSize: typography.caption,
    fontWeight: typography.weightBold,
    color: '#FF7A1A',
  },
});
