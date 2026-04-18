import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { haptic } from '../utils/haptics';

interface AnxietyRaterProps {
  label: string;
  value: number | null;
  onChange: (rating: number) => void;
}

const CIRCLE_COLORS = [
  '#22c55e', '#4ade80', '#86efac', '#bef264', '#facc15',
  '#fbbf24', '#fb923c', '#f97316', '#ef4444', '#dc2626',
];

export function AnxietyRater({ label, value, onChange }: AnxietyRaterProps) {
  const handlePress = (rating: number) => {
    haptic.selection();
    onChange(rating);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {Array.from({ length: 10 }, (_, i) => {
          const rating = i + 1;
          const isSelected = value === rating;
          return (
            <TouchableOpacity
              key={rating}
              onPress={() => handlePress(rating)}
              style={[
                styles.circle,
                {
                  backgroundColor: isSelected ? CIRCLE_COLORS[i] : '#1F1F1F',
                  borderColor: isSelected ? CIRCLE_COLORS[i] : 'rgba(255,255,255,0.08)',
                },
              ]}
            >
              <Text
                style={[
                  styles.circleText,
                  { color: isSelected ? '#fff' : '#8A8A8A' },
                ]}
              >
                {rating}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.anchors}>
        <Text style={styles.anchor}>Calm</Text>
        <Text style={styles.anchor}>Very anxious</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#141414',
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  label: {
    fontSize: typography.body,
    fontWeight: typography.weightSemi,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleText: {
    fontSize: 12,
    fontWeight: typography.weightSemi,
  },
  anchors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  anchor: {
    fontSize: typography.small,
    color: '#8A8A8A',
  },
});
