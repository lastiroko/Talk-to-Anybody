import { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONFETTI_COLORS = ['#FF4500', '#FF7A1A', '#E63946', '#FACC15', '#4ADE80', '#FFFFFF'];
const PARTICLE_COUNT = 25;

interface CelebrationProps {
  trigger: boolean;
  variant?: 'confetti' | 'glow';
}

interface Particle {
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  rotate: Animated.Value;
  color: string;
  size: number;
  startX: number;
}

export function Celebration({ trigger, variant = 'confetti' }: CelebrationProps) {
  const particles = useRef<Particle[]>([]);
  const glowScale = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!trigger || hasTriggered.current) return;
    hasTriggered.current = true;

    if (variant === 'glow') {
      glowOpacity.setValue(0.6);
      glowScale.setValue(0);
      Animated.parallel([
        Animated.timing(glowScale, {
          toValue: 1.5,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    // Confetti
    particles.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(1),
      rotate: new Animated.Value(0),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 6,
      startX: Math.random() * SCREEN_WIDTH,
    }));

    const animations = particles.current.map((p) => {
      const drift = (Math.random() - 0.5) * 80;
      return Animated.parallel([
        Animated.timing(p.y, {
          toValue: SCREEN_HEIGHT * 0.6 + Math.random() * 200,
          duration: 1800 + Math.random() * 400,
          useNativeDriver: true,
        }),
        Animated.timing(p.x, {
          toValue: drift,
          duration: 1800 + Math.random() * 400,
          useNativeDriver: true,
        }),
        Animated.timing(p.opacity, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(p.rotate, {
          toValue: Math.random() * 4 - 2,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(animations).start();

    return () => {
      particles.current = [];
    };
  }, [trigger, variant, glowScale, glowOpacity]);

  // Reset when trigger goes false
  useEffect(() => {
    if (!trigger) {
      hasTriggered.current = false;
    }
  }, [trigger]);

  if (!trigger) return null;

  if (variant === 'glow') {
    return (
      <View style={styles.container} pointerEvents="none">
        <Animated.View
          style={[
            styles.glow,
            {
              transform: [{ scale: glowScale }],
              opacity: glowOpacity,
            },
          ]}
        />
      </View>
    );
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.current.map((p, i) => {
        const spin = p.rotate.interpolate({
          inputRange: [-2, 2],
          outputRange: ['-180deg', '180deg'],
        });
        return (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                width: p.size,
                height: p.size,
                borderRadius: Math.random() > 0.5 ? p.size / 2 : 2,
                backgroundColor: p.color,
                left: p.startX,
                opacity: p.opacity,
                transform: [
                  { translateX: p.x },
                  { translateY: p.y },
                  { rotate: spin },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  particle: {
    position: 'absolute',
    top: -10,
  },
  glow: {
    position: 'absolute',
    alignSelf: 'center',
    top: '30%',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FF4500',
  },
});
