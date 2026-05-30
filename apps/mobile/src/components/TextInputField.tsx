import { ReactNode } from 'react';
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface TextInputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  returnKeyType?: 'done' | 'next' | 'go' | 'search' | 'send';
  rightIcon?: ReactNode;
  placeholder?: string;
}

export function TextInputField({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  returnKeyType,
  rightIcon,
  placeholder,
}: TextInputFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
        />
        {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.caption,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.weightBold,
    color: colors.primary,
    letterSpacing: 0.4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    minHeight: 56,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontSize: typography.body,
    fontFamily: typography.fontFamily.regular,
    color: colors.text,
    paddingVertical: 14,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
  error: {
    fontSize: typography.small,
    fontFamily: typography.fontFamily.medium,
    color: colors.error,
    marginTop: 2,
  },
});
