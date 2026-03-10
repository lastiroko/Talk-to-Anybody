import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { TextInputField } from '../components/TextInputField';
import { SocialButton } from '../components/SocialButton';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

interface LoginScreenProps {
  onAuthenticated: () => void;
  onBack: () => void;
}

export function LoginScreen({ onAuthenticated, onBack }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = email.includes('@') && password.length >= 1 && !loading;

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAuthenticated();
    }, 1000);
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Continue your speaking journey</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextInputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            placeholder="you@example.com"
          />

          <View>
            <TextInputField
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              returnKeyType="done"
              placeholder="Your password"
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.eyeIcon}>{showPassword ? '\ud83d\ude48' : '\ud83d\udc41\ufe0f'}</Text>
                </TouchableOpacity>
              }
            />
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  'Coming soon',
                  'Password reset will be available in the next update.',
                )
              }
              style={styles.forgotLink}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <PrimaryButton
            title={loading ? 'Logging in...' : 'Log in'}
            onPress={handleLogin}
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
            Don't have an account? <Text style={styles.footerLink}>Sign up</Text>
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
  eyeIcon: {
    fontSize: 20,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
  },
  forgotText: {
    fontSize: typography.small,
    color: colors.primary,
    fontWeight: typography.weightSemi,
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
