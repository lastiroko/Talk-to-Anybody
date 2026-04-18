import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface CategoryPillProps {
  label: string;
  color: string;
  icon?: string;
  onPress?: () => void;
}

export function CategoryPill({ label, color, icon, onPress }: CategoryPillProps) {
  return (
    <TouchableOpacity
      style={styles.pill}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={[styles.iconCircle, { backgroundColor: color }]}>
        <Text style={styles.icon}>{icon ?? '\u2022'}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    paddingRight: 14,
    paddingLeft: 4,
    paddingVertical: 4,
    borderRadius: 999,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  label: {
    fontSize: typography.caption,
    fontWeight: typography.weightSemi,
    color: '#FFFFFF',
  },
});
