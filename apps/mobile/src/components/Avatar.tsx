import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface AvatarProps {
  size?: number;
  from?: string;
  to?: string;
  icon?: IoniconName;
  ring?: boolean;
}

/**
 * Gradient avatar circle with a centered Ionicon glyph.
 * Used in headers, leaderboards, and challenge rows.
 */
export function Avatar({
  size = 44,
  from = '#FFB07A',
  to = '#FF7A45',
  icon = 'person',
  ring = false,
}: AvatarProps) {
  return (
    <LinearGradient
      colors={[from, to]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#1F1B16',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.14,
        shadowRadius: 14,
        elevation: 3,
        borderWidth: ring ? 2.5 : 0,
        borderColor: '#FFFFFF',
      }}
    >
      <Ionicons name={icon} size={size * 0.52} color="rgba(255,255,255,0.95)" />
    </LinearGradient>
  );
}
