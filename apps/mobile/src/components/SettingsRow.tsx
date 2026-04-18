import { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface SettingsRowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: ReactNode;
  destructive?: boolean;
}

export function SettingsRow({ label, value, onPress, rightElement, destructive }: SettingsRowProps) {
  const content = (
    <View style={styles.row}>
      <Text style={[styles.label, destructive && styles.destructiveLabel]}>{label}</Text>
      <View style={styles.right}>
        {value ? <Text style={styles.value}>{value}</Text> : null}
        {rightElement}
        {onPress && !rightElement ? <Text style={styles.chevron}>{'\u203a'}</Text> : null}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  label: {
    fontSize: typography.body,
    color: '#FFFFFF',
    flex: 1,
  },
  destructiveLabel: {
    color: '#E63946',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  value: {
    fontSize: typography.body,
    color: '#8A8A8A',
  },
  chevron: {
    fontSize: 20,
    color: '#8A8A8A',
  },
});
