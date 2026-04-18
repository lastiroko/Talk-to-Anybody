import { Platform } from 'react-native';

export const shadows = {
  card: Platform.select({
    ios: { shadowColor: '#000000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 24 },
    android: { elevation: 4 },
  }),
  soft: Platform.select({
    ios: { shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 6 },
    android: { elevation: 2 },
  }),
  elevated: Platform.select({
    ios: { shadowColor: '#000000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.6, shadowRadius: 30 },
    android: { elevation: 8 },
  }),
  bloom: Platform.select({
    ios: { shadowColor: '#FF5B0A', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.35, shadowRadius: 30 },
    android: { elevation: 6 },
  }),
};
