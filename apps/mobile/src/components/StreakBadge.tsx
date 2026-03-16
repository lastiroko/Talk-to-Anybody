import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface StreakBadgeProps {
  count: number;
  style?: ViewStyle;
}

export function StreakBadge({ count, style }: StreakBadgeProps) {
  return (
    <View style={[styles.pill, style]}>
      <Text style={styles.fire}>{'\ud83d\udd25'}</Text>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
  },
  fire: {
    fontSize: 14,
  },
  count: {
    fontSize: typography.caption,
    fontWeight: typography.weightBold,
    color: colors.fire,
  },
});
