import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { TextInputField } from '../components/TextInputField';
import { SocialButton } from '../components/SocialButton';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { apiLogin } from '../services/api';
import { setToken, setUser } from '../storage/auth';

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

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await apiLogin(email, password);
      await setToken(res.accessToken);
      await setUser(res.user);
      onAuthenticated();
    } catch (err: any) {
      const msg = err.status === 401
        ? 'Invalid email or password'
        : 'Something went wrong. Try again.';
      Alert.alert('Login failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Pick up where you left off</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextInputField
            label="EMAIL"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            placeholder="you@example.com"
          />

          <View>
            <TextInputField
              label="PASSWORD"
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
          <Text style={styles.dividerText}>OR</Text>
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
            No account yet?{' '}
            <Text style={styles.footerLink}>Sign up</Text>
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
    backgroundColor: colors.background,
  },
  header: {
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  title: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.heading,
    color: colors.text,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.body,
    color: colors.textMuted,
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
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.small,
    color: colors.primary,
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
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.small,
    color: colors.textLight,
    letterSpacing: 2,
  },
  socials: {
    gap: spacing.sm,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  footerText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.body,
    color: colors.textMuted,
  },
  footerLink: {
    color: colors.primary,
    fontFamily: typography.fontFamily.semiBold,
  },
});
