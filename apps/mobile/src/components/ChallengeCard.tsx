import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { shadows } from '../theme/shadows';

interface ChallengeCardProps {
  title: string;
  subtitle: string;
  progress: string;
  gems?: number;
  coins?: number;
  icon: string;
  onPress: () => void;
}

export function ChallengeCard({ title, subtitle, progress, gems, coins, icon, onPress }: ChallengeCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scale, { toValue: 0.97, duration: 100, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, tension: 300, friction: 10, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        style={[styles.card, shadows.card]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.center}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
          <Text style={styles.progress}>{progress}</Text>
        </View>
        <View style={styles.rewards}>
          {gems ? (
            <Text style={styles.reward}>{'\ud83d\udc8e'}+{gems}</Text>
          ) : null}
          {coins ? (
            <Text style={styles.reward}>{'\ud83e\ude99'}+{coins}</Text>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.md,
    gap: spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
  },
  center: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: typography.body,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.small,
    color: colors.textMuted,
  },
  progress: {
    fontSize: typography.tiny,
    fontWeight: typography.weightSemi,
    color: colors.primary,
    marginTop: 2,
  },
  rewards: {
    alignItems: 'flex-end',
    gap: 2,
  },
  reward: {
    fontSize: typography.small,
    fontWeight: typography.weightBold,
    color: colors.gold,
  },
});
