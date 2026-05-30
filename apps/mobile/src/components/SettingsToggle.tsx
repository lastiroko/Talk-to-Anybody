import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';

interface SettingsToggleProps {
  value: boolean;
  onToggle: () => void;
}

export function SettingsToggle({ value, onToggle }: SettingsToggleProps) {
  return (
    <TouchableOpacity
      style={[styles.track, value && styles.trackOn]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.knob, value && styles.knobOn]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surfaceMuted,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  trackOn: {
    backgroundColor: colors.primary,
  },
  knob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surface,
    shadowColor: '#1F1B16',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  knobOn: {
    alignSelf: 'flex-end',
  },
});
