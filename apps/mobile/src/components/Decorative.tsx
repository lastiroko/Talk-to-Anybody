import { View, ViewStyle, StyleSheet } from 'react-native';

interface GradientOrbProps {
  size: number;
  color: string;
  style?: ViewStyle;
}

export function GradientOrb({ size, color, style }: GradientOrbProps) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: 0.15,
          position: 'absolute',
          zIndex: -1,
        },
        style,
      ]}
    />
  );
}

interface DotPatternProps {
  rows: number;
  cols: number;
  style?: ViewStyle;
}

export function DotPattern({ rows, cols, style }: DotPatternProps) {
  return (
    <View
      style={[
        styles.dotContainer,
        style,
        { position: 'absolute', zIndex: -1 },
      ]}
    >
      {Array.from({ length: rows }, (_, r) => (
        <View key={r} style={styles.dotRow}>
          {Array.from({ length: cols }, (_, c) => (
            <View key={c} style={styles.dot} />
          ))}
        </View>
      ))}
    </View>
  );
}

interface WaveDividerProps {
  color?: string;
  style?: ViewStyle;
}

export function WaveDivider({ color = '#e2e8f0', style }: WaveDividerProps) {
  return (
    <View style={[styles.waveContainer, style]}>
      {Array.from({ length: 6 }, (_, i) => (
        <View
          key={i}
          style={[
            styles.waveCircle,
            {
              backgroundColor: color,
              left: i * 24 - 4,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dotContainer: {
    gap: 12,
  },
  dotRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#0f172a',
    opacity: 0.08,
  },
  waveContainer: {
    height: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  waveCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    position: 'absolute',
    top: 2,
    opacity: 0.25,
  },
});
