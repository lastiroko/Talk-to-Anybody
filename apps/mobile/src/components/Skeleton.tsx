import { useEffect, useRef } from 'react';
import { Animated, DimensionValue, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface SkeletonProps {
  width: DimensionValue;
  height: number;
  radius?: number;
  style?: ViewStyle;
}

function SkeletonBase({ width, height, radius = 8, style }: SkeletonProps) {
  const shimmer = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [shimmer]);

  const translateX = shimmer.interpolate({
    inputRange: [-1, 1],
    outputRange: [-100, 100],
  });

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: '#1F1F1F',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          { transform: [{ translateX }] },
        ]}
      />
    </View>
  );
}

export function Skeleton(props: SkeletonProps) {
  return <SkeletonBase {...props} />;
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <SkeletonBase width="60%" height={16} radius={8} />
      <SkeletonBase width="100%" height={12} radius={6} style={{ marginTop: spacing.sm }} />
      <SkeletonBase width="80%" height={12} radius={6} style={{ marginTop: spacing.xs }} />
    </View>
  );
}

export function SkeletonLine({ width = '100%' as DimensionValue }) {
  return <SkeletonBase width={width} height={14} radius={7} />;
}

export function SkeletonCircle({ size }: { size: number }) {
  return <SkeletonBase width={size} height={size} radius={size / 2} />;
}

const styles = StyleSheet.create({
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  card: {
    backgroundColor: '#141414',
    borderRadius: 14,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
});
