import 'react-native-gesture-handler';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ProgressProvider } from './src/hooks/useProgress';

export default function App() {
  const [flow, setFlow] = useState<'auth' | 'onboarding' | 'main'>('auth');

  return (
    <ProgressProvider>
      <StatusBar style="dark" />
      <AppNavigator
        flow={flow}
        onAuthenticated={() => setFlow('onboarding')}
        onOnboardingComplete={() => setFlow('main')}
      />
    </ProgressProvider>
  );
}
