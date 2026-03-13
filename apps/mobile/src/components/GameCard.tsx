import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
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
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (locked) return;
    Animated.timing(scale, {
      toValue: 0.97,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (locked) return;
    Animated.spring(scale, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ flex: 1, transform: [{ scale }] }]}>
      <Pressable
        style={[styles.card, locked && styles.locked]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={locked}
      >
        <Text style={styles.icon}>{locked ? '\ud83d\udd12' : icon}</Text>
        <Text style={[styles.title, locked && styles.lockedText]}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {locked ? `Unlocks on Day ${unlockDay}` : description}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
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
