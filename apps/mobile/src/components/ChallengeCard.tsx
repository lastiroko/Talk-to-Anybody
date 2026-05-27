import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { shadows } from '../theme/shadows';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface ChallengeCardProps {
  title: string;
  subtitle: string;
  progress: string;
  gems?: number;
  coins?: number;
  icon: IoniconName;
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
          <Ionicons name={icon} size={22} color={colors.primary} />
        </View>
        <View style={styles.center}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
          <Text style={styles.progress}>{progress}</Text>
        </View>
        <View style={styles.rewards}>
          {gems ? (
            <View style={styles.rewardChip}>
              <Ionicons name="diamond" size={12} color={colors.gem} />
              <Text style={styles.reward}>+{gems}</Text>
            </View>
          ) : null}
          {coins ? (
            <View style={styles.rewardChip}>
              <Ionicons name="ellipse" size={12} color={colors.coin} />
              <Text style={styles.reward}>+{coins}</Text>
            </View>
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
    backgroundColor: '#141414',
    borderRadius: 18,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,69,0,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: typography.body,
    fontWeight: typography.weightBold,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: typography.small,
    color: '#8A8A8A',
  },
  progress: {
    fontSize: typography.tiny,
    fontWeight: typography.weightSemi,
    color: '#FF4500',
    marginTop: 2,
  },
  rewards: {
    alignItems: 'flex-end',
    gap: 4,
  },
  rewardChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  reward: {
    fontSize: typography.small,
    fontWeight: typography.weightBold,
    color: '#FF7A1A',
  },
});
