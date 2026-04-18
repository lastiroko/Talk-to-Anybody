import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

interface ProgressBarProps {
  progress: number; // 0-1
  color?: string;
}

export function ProgressBar({ progress, color = '#FF4500' }: ProgressBarProps) {
  const clampedProgress = Math.min(1, Math.max(0, progress));

  return (
    <View style={styles.track}>
      <View
        style={[
          styles.fill,
          { width: `${clampedProgress * 100}%`, backgroundColor: color },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    backgroundColor: '#1F1F1F',
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
