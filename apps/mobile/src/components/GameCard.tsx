import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface GameCardProps {
  icon: string;
  title: string;
  description: string;
  locked: boolean;
  unlockDay?: number;
  onPress: () => void;
}

export function GameCard({ icon, title, description, locked, unlockDay, onPress }: GameCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, locked && styles.locked]}
      onPress={onPress}
      activeOpacity={locked ? 1 : 0.7}
      disabled={locked}
    >
      <Text style={styles.icon}>{locked ? '\ud83d\udd12' : icon}</Text>
      <Text style={[styles.title, locked && styles.lockedText]}>{title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {locked ? `Unlocks on Day ${unlockDay}` : description}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 130,
  },
  locked: {
    opacity: 0.55,
    backgroundColor: '#f8fafc',
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: typography.small,
    fontWeight: typography.weightBold,
    color: colors.text,
    textAlign: 'center',
  },
  lockedText: {
    color: colors.muted,
  },
  description: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
