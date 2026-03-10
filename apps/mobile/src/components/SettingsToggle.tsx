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
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  trackOn: {
    backgroundColor: colors.primary,
  },
  knob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
  },
  knobOn: {
    alignSelf: 'flex-end',
  },
});
