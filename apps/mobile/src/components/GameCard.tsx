import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

const GAME_COLORS: Record<string, string> = {
  '\ud83d\udd04': colors.categoryOrange,
  '\u23f8\ufe0f': colors.teal,
  '\ud83d\udcd6': colors.gold,
  '\ud83d\udc8e': colors.categoryPurple,
};

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
  const circleColor = GAME_COLORS[icon] ?? colors.primary;

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
        <View style={[styles.iconCircle, { backgroundColor: locked ? '#4A4A4A' : circleColor }]}>
          <Text style={styles.icon}>{locked ? '\ud83d\udd12' : icon}</Text>
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
    backgroundColor: '#141414',
    borderRadius: 18,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 140,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
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
  icon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  title: {
    fontSize: typography.caption,
    fontWeight: typography.weightBold,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  lockedText: {
    color: '#8A8A8A',
  },
  description: {
    fontSize: typography.tiny,
    color: '#8A8A8A',
    textAlign: 'center',
    lineHeight: 14,
  },
  playBadge: {
    backgroundColor: 'rgba(255,69,0,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 2,
  },
  playText: {
    fontSize: typography.tiny,
    fontWeight: typography.weightBold,
    color: '#FF4500',
  },
});
