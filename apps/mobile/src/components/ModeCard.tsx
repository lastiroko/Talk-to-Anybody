import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface ModeCardProps {
  icon: IoniconName;
  iconColor?: string;
  title: string;
  description: string;
  onPress: () => void;
}

export function ModeCard({ icon, iconColor, title, description, onPress }: ModeCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const circleColor = iconColor ?? colors.primary;

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
          <Ionicons name={icon} size={22} color="#FFFFFF" />
        </View>
        <View style={styles.textArea}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <Text style={styles.arrow}>{'›'}</Text>
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
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textArea: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: typography.subheading,
    fontWeight: typography.weightBold,
    color: '#FFFFFF',
  },
  description: {
    fontSize: typography.small,
    color: '#8A8A8A',
    lineHeight: 18,
  },
  arrow: {
    fontSize: 24,
    color: '#8A8A8A',
  },
});
