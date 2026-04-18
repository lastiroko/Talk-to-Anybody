import 'react-native-gesture-handler';
import { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
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

export default function App() {
  const [flow, setFlow] = useState<'auth' | 'onboarding' | 'main'>('auth');

  const [fontsLoaded] = useFonts({
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_600SemiBold,
    JetBrainsMono_700Bold,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A0A0A', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#FF4500" size="large" />
      </View>
    );
  }

  return (
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
  );
}
