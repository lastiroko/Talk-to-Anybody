import { Platform } from 'react-native';

export const shadows = {
  card: Platform.select({
    ios: { shadowColor: '#1A2138', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12 },
    android: { elevation: 3 },
  }),
  soft: Platform.select({
    ios: { shadowColor: '#1A2138', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6 },
    android: { elevation: 1 },
  }),
  elevated: Platform.select({
    ios: { shadowColor: '#1A2138', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 20 },
    android: { elevation: 6 },
  }),
};
