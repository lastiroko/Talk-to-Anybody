import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

const MODE_COLORS: Record<string, string> = {
  '\ud83c\udfa4': colors.primary,        // Freestyle - blue
  '\ud83d\udcdd': colors.categoryPurple,  // Script - purple
  '\u26a1': colors.categoryOrange,        // Impromptu - orange
  '\ud83c\udfad': colors.teal,            // Roleplay - teal
};

interface ModeCardProps {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
}

export function ModeCard({ icon, title, description, onPress }: ModeCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const circleColor = MODE_COLORS[icon] ?? colors.primary;

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
        <View style={[styles.iconCircle, { backgroundColor: circleColor }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.textArea}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <Text style={styles.arrow}>{'\u203a'}</Text>
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
    padding: spacing.lg,
    gap: spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
    color: '#FFFFFF',
  },
  textArea: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: typography.subheading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  description: {
    fontSize: typography.small,
    color: colors.textMuted,
    lineHeight: 18,
  },
  arrow: {
    fontSize: 24,
    color: colors.textMuted,
  },
});
