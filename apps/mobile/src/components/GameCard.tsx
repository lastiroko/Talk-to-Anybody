import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface GameCardProps {
  icon: IoniconName;
  iconColor?: string;
  title: string;
  description: string;
  locked: boolean;
  unlockDay?: number;
  onPress: () => void;
}

export function GameCard({ icon, iconColor, title, description, locked, unlockDay, onPress }: GameCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const circleColor = iconColor ?? colors.primary;

  const handlePressIn = () => {
    if (locked) return;
    Animated.timing(scale, { toValue: 0.97, duration: 100, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    if (locked) return;
    Animated.spring(scale, { toValue: 1, tension: 300, friction: 10, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[{ flex: 1, transform: [{ scale }] }]}>
      <Pressable
        style={[styles.card, shadows.card, locked && styles.locked]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={locked}
      >
        <View style={[styles.iconCircle, { backgroundColor: locked ? colors.textMuted : circleColor }]}>
          <Ionicons name={locked ? 'lock-closed-outline' : icon} size={20} color="#FFFFFF" />
        </View>
        <Text style={[styles.title, locked && styles.lockedText]}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {locked ? `Unlocks Day ${unlockDay}` : description}
        </Text>
        {!locked ? (
          <View style={styles.playBadge}>
            <Text style={styles.playText}>Play</Text>
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 140,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locked: {
    opacity: 0.55,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.caption,
    fontWeight: typography.weightBold,
    color: colors.text,
    textAlign: 'center',
  },
  lockedText: {
    color: colors.textMuted,
  },
  description: {
    fontSize: typography.tiny,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 14,
  },
  playBadge: {
    backgroundColor: colors.recordBg,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 2,
  },
  playText: {
    fontSize: typography.tiny,
    fontWeight: typography.weightBold,
    color: colors.primary,
  },
});
