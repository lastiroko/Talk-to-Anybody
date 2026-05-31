import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';
import { colors as themeColors } from '../theme/colors';

interface SquiggleProps {
  width?: number;
  color?: string;
  style?: ViewStyle;
}

/** Hand-drawn coral marker underline used under hero headlines. */
export function Squiggle({ width = 120, color = themeColors.primary, style }: SquiggleProps) {
  return (
    <Svg width={width} height={14} viewBox="0 0 120 14" style={style as any}>
      <Path
        d="M2 8.5C18 4 34 11 52 7.5C70 4 84 12 102 7C110 4.8 115 6 118 5.5"
        stroke={color}
        strokeWidth={3.4}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
