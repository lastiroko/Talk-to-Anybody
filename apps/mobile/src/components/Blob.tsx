import { View, ViewStyle } from 'react-native';

interface BlobProps {
  color: string;
  size?: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  opacity?: number;
  style?: ViewStyle;
}

/**
 * Soft pastel blob with organic (non-circular) border radius.
 * Used as ambient background mood in hero sections.
 *
 * Note: React Native doesn't support CSS blur on native, so we layer
 * a semi-transparent organic shape and rely on its low opacity for softness.
 */
export function Blob({
  color,
  size = 240,
  top,
  left,
  right,
  bottom,
  opacity = 0.55,
  style,
}: BlobProps) {
  return (
    <View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          backgroundColor: color,
          opacity,
          // Organic blob shape — asymmetric border radii (CSS-equivalent of 48% 52% 56% 44% / 50% 46% 54% 50%)
          borderTopLeftRadius: size * 0.48,
          borderTopRightRadius: size * 0.52,
          borderBottomRightRadius: size * 0.56,
          borderBottomLeftRadius: size * 0.44,
          top,
          left,
          right,
          bottom,
        },
        style,
      ]}
    />
  );
}
