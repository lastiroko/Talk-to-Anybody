import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

interface UseEntryAnimationReturn {
  fadeIn: (index: number) => {
    opacity: Animated.Value;
    transform: [{ translateY: Animated.Value }];
  };
  triggerEntry: () => void;
}

export function useEntryAnimation(count: number): UseEntryAnimationReturn {
  const opacities = useRef<Animated.Value[]>([]);
  const translates = useRef<Animated.Value[]>([]);

  if (opacities.current.length !== count) {
    opacities.current = Array.from({ length: count }, () => new Animated.Value(0));
    translates.current = Array.from({ length: count }, () => new Animated.Value(20));
  }

  const triggerEntry = () => {
    const animations = opacities.current.map((_, i) =>
      Animated.parallel([
        Animated.timing(opacities.current[i], {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translates.current[i], {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    );

    Animated.stagger(80, animations).start();
  };

  useEffect(() => {
    triggerEntry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fadeIn = (index: number) => ({
    opacity: opacities.current[index] ?? new Animated.Value(1),
    transform: [{ translateY: translates.current[index] ?? new Animated.Value(0) }] as [{ translateY: Animated.Value }],
  });

  return { fadeIn, triggerEntry };
}
