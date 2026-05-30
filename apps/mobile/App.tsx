import 'react-native-gesture-handler';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { initNotifications } from './src/services/notifications';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_600SemiBold,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';
import {
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ProgressProvider } from './src/hooks/useProgress';
import { PurchaseProvider } from './src/hooks/usePurchase';
import { AuthFlowProvider } from './src/contexts/AuthFlowContext';
import {
  apiBootstrapSession,
  apiLogout,
  setAuthExpiredHandler,
} from './src/services/api';
import { clearAuth, getRefreshToken } from './src/storage/auth';

type Flow = 'auth' | 'onboarding' | 'main';

export default function App() {
  const [flow, setFlow] = useState<Flow>('auth');
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    initNotifications().catch(() => undefined);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Try to mint a new access token from the stored refresh token.
      // If it works, skip the auth screens.
      const ok = await apiBootstrapSession();
      if (cancelled) return;
      if (ok) setFlow('main');
      setBootstrapped(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signOut = useCallback(async () => {
    const refreshToken = await getRefreshToken();
    if (refreshToken) await apiLogout(refreshToken);
    await clearAuth();
    setFlow('auth');
  }, []);

  useEffect(() => {
    setAuthExpiredHandler(() => setFlow('auth'));
    return () => setAuthExpiredHandler(null);
  }, []);

  const authFlowValue = useMemo(() => ({ signOut }), [signOut]);

  const [fontsLoaded] = useFonts({
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_600SemiBold,
    JetBrainsMono_700Bold,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  if (!fontsLoaded || !bootstrapped) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A0A0A', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#FF4500" size="large" />
      </View>
    );
  }

  return (
    <AuthFlowProvider value={authFlowValue}>
      <ProgressProvider>
        <PurchaseProvider>
          <StatusBar style="light" />
          <AppNavigator
            flow={flow}
            onAuthenticated={() => setFlow('onboarding')}
            onOnboardingComplete={() => setFlow('main')}
          />
        </PurchaseProvider>
      </ProgressProvider>
    </AuthFlowProvider>
  );
}
