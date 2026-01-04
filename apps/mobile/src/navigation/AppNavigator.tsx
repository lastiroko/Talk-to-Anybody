import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
import { OnboardingGoalScreen } from '../screens/OnboardingGoalScreen';
import { OnboardingScheduleScreen } from '../screens/OnboardingScheduleScreen';
import { BaselineScreen } from '../screens/BaselineScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { PlanScreen } from '../screens/PlanScreen';
import { PracticeScreen } from '../screens/PracticeScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { DayDetailScreen } from '../screens/DayDetailScreen';
import {
  AuthStackParamList,
  MainStackParamList,
import {
  AuthStackParamList,
  OnboardingStackParamList,
  TabsParamList,
} from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const Tabs = createBottomTabNavigator<TabsParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

type Flow = 'auth' | 'onboarding' | 'main';

interface AppNavigatorProps {
  flow: Flow;
  onAuthenticated: () => void;
  onOnboardingComplete: () => void;
}

function AuthNavigator({ onAuthenticated }: { onAuthenticated: () => void }) {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Welcome" options={{ headerShown: false }}>
        {({ navigation }) => (
          <WelcomeScreen
            onLogin={() => navigation.navigate('Login')}
            onSignup={() => navigation.navigate('Signup')}
          />
        )}
      </AuthStack.Screen>
      <AuthStack.Screen name="Login" options={{ title: 'Log in' }}>
        {({ navigation }) => (
          <LoginScreen
            onAuthenticated={onAuthenticated}
            onBack={() => navigation.goBack()}
          />
        )}
      </AuthStack.Screen>
      <AuthStack.Screen name="Signup" options={{ title: 'Create account' }}>
        {({ navigation }) => (
          <SignupScreen onCreated={onAuthenticated} onBack={() => navigation.goBack()} />
        )}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  );
}

function OnboardingNavigator({ onDone }: { onDone: () => void }) {
  return (
    <OnboardingStack.Navigator>
      <OnboardingStack.Screen name="OnboardingGoal" options={{ title: 'Your goal' }}>
        {({ navigation }) => (
          <OnboardingGoalScreen onNext={() => navigation.navigate('OnboardingSchedule')} />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="OnboardingSchedule" options={{ title: 'Time per day' }}>
        {({ navigation }) => (
          <OnboardingScheduleScreen onNext={() => navigation.navigate('Baseline')} />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="Baseline" options={{ title: 'Baseline recording' }}>
        {() => <BaselineScreen onComplete={onDone} />}
      </OnboardingStack.Screen>
    </OnboardingStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Plan" component={PlanScreen} />
      <Tabs.Screen name="Practice" component={PracticeScreen} />
      <Tabs.Screen name="Progress" component={ProgressScreen} />
      <Tabs.Screen name="Settings" component={SettingsScreen} />
    </Tabs.Navigator>
  );
}

export function AppNavigator({ flow, onAuthenticated, onOnboardingComplete }: AppNavigatorProps) {
  return (
    <NavigationContainer>
      {flow === 'auth' && <AuthNavigator onAuthenticated={onAuthenticated} />}
      {flow === 'onboarding' && <OnboardingNavigator onDone={onOnboardingComplete} />}
      {flow === 'main' && (
        <MainStack.Navigator>
          <MainStack.Screen name="Tabs" component={MainTabs} options={{ headerShown: false }} />
          <MainStack.Screen
            name="DayDetail"
            component={DayDetailScreen}
            options={({ route }) => ({ title: `Day ${route.params.dayNumber}` })}
          />
        </MainStack.Navigator>
      )}
      {flow === 'main' && <MainTabs />}
    </NavigationContainer>
  );
}
