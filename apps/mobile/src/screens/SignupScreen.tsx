import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { TextInputField } from '../components/TextInputField';
import { SocialButton } from '../components/SocialButton';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

interface SignupScreenProps {
  onCreated: () => void;
  onBack: () => void;
}

export function SignupScreen({ onCreated, onBack }: SignupScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const isEmailValid = email.includes('@') && email.includes('.');
  const isPasswordValid = password.length >= 8;
  const canSubmit = isEmailValid && isPasswordValid && !loading;

  const handleSignup = () => {
    setEmailError('');
    setPasswordError('');

    if (!isEmailValid) {
      setEmailError('Please enter a valid email address');
      return;
    }
    if (!isPasswordValid) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onCreated();
    }, 1000);
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Join 10,000+ people finding their voice
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextInputField
            label="Email"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            placeholder="you@example.com"
            error={emailError}
          />

          <View>
            <TextInputField
              label="Password"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                setPasswordError('');
              }}
              secureTextEntry={!showPassword}
              returnKeyType="done"
              placeholder="Create a password"
              error={passwordError}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.eyeIcon}>{showPassword ? '\ud83d\ude48' : '\ud83d\udc41\ufe0f'}</Text>
                </TouchableOpacity>
              }
            />
            <Text style={styles.hint}>At least 8 characters</Text>
          </View>

          <PrimaryButton
            title={loading ? 'Creating account...' : 'Sign up'}
            onPress={handleSignup}
            disabled={!canSubmit}
          />
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social buttons */}
        <View style={styles.socials}>
          <SocialButton provider="apple" onPress={() => Alert.alert('Coming soon', 'Apple sign-in will be available soon.')} />
          <SocialButton provider="google" onPress={() => Alert.alert('Coming soon', 'Google sign-in will be available soon.')} />
        </View>

        {/* Footer */}
        <TouchableOpacity onPress={onBack} style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.footerLink}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  title: {
    fontSize: typography.heading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.muted,
  },
  form: {
    gap: spacing.md,
  },
  hint: {
    fontSize: typography.small,
    color: colors.muted,
    marginTop: spacing.xs,
  },
  eyeIcon: {
    fontSize: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: typography.small,
    color: colors.muted,
  },
  socials: {
    gap: spacing.sm,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  footerText: {
    fontSize: typography.body,
    color: colors.muted,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: typography.weightSemi,
  },
});
