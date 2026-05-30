import { Platform } from 'react-native';

// SpeakCoach shadows — Brief v3 (soft warm shadows on light bg)
export const shadows = {
  // Default card shadow: subtle, warm
  card: Platform.select({
    ios: {
      shadowColor: '#1F1B16',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.06,
      shadowRadius: 24,
    },
    android: { elevation: 2 },
  }),
  // Soft inline shadow for small surfaces
  soft: Platform.select({
    ios: {
      shadowColor: '#1F1B16',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    android: { elevation: 1 },
  }),
  // Warm peach shadow under tinted hero cards
  warmCard: Platform.select({
    ios: {
      shadowColor: '#FF7A45',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 24,
    },
    android: { elevation: 3 },
  }),
  // Elevated modals
  elevated: Platform.select({
    ios: {
      shadowColor: '#1F1B16',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.10,
      shadowRadius: 30,
    },
    android: { elevation: 6 },
  }),
  // Coral bloom under primary CTAs
  bloom: Platform.select({
    ios: {
      shadowColor: '#FF7A45',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.30,
      shadowRadius: 24,
    },
    android: { elevation: 4 },
  }),
};
