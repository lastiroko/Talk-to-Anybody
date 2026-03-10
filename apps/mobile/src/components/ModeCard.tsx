import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface ModeCardProps {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
}

export function ModeCard({ icon, title, description, onPress }: ModeCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.textArea}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Text style={styles.arrow}>{'\u203a'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  icon: {
    fontSize: 32,
  },
  textArea: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: typography.subheading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  description: {
    fontSize: typography.small,
    color: colors.muted,
    lineHeight: 20,
  },
  arrow: {
    fontSize: 24,
    color: colors.muted,
  },
});
