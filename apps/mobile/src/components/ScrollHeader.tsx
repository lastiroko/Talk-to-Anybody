import { Animated, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface ScrollHeaderProps {
  title: string;
  scrollY: Animated.Value;
}

export function ScrollHeader({ title, scrollY }: ScrollHeaderProps) {
  const backgroundOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const fontSize = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [28, 18],
    extrapolate: 'clamp',
  });

  const shadowOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 0.1],
    extrapolate: 'clamp',
  });

  const paddingBottom = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [spacing.lg, spacing.sm],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.header,
        {
          shadowOpacity,
          paddingBottom,
        },
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: '#0A0A0A',
            opacity: backgroundOpacity,
          },
        ]}
      />
      <Animated.Text
        style={[
          styles.title,
          { fontSize },
        ]}
      >
        {title}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontWeight: typography.weightBold,
    color: '#FFFFFF',
  },
});
