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
          placeholderTextColor="#4A4A4A"
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
    fontSize: typography.small,
    fontWeight: typography.weightSemi,
    color: '#8A8A8A',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    backgroundColor: '#1F1F1F',
    paddingHorizontal: spacing.md,
  },
  inputError: {
    borderColor: '#E63946',
  },
  input: {
    flex: 1,
    fontSize: typography.body,
    color: '#FFFFFF',
    paddingVertical: 14,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
  error: {
    fontSize: typography.small,
    color: '#E63946',
  },
});
