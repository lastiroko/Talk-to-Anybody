import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { haptic } from '../utils/haptics';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];
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
import { FreestyleScreen } from '../screens/FreestyleScreen';
import { ScriptModeScreen } from '../screens/ScriptModeScreen';
import { ImpromptuScreen } from '../screens/ImpromptuScreen';
import { RoleplayScreen } from '../screens/RoleplayScreen';
import { FillerSwapScreen } from '../screens/FillerSwapScreen';
import { PausePunchScreen } from '../screens/PausePunchScreen';
import { ABTBuilderScreen } from '../screens/ABTBuilderScreen';
import { ClaritySprintScreen } from '../screens/ClaritySprintScreen';
import { ExerciseRecordScreen } from '../screens/ExerciseRecordScreen';
import { AnalysisResultScreen } from '../screens/AnalysisResultScreen';
import { PaywallScreen } from '../screens/PaywallScreen';
import {
  AuthStackParamList,
  MainStackParamList,
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

const TAB_ICONS: Record<string, IoniconName> = {
  Home: 'home-outline',
  Plan: 'calendar-outline',
  Practice: 'mic-outline',
  Progress: 'stats-chart-outline',
  Settings: 'settings-outline',
};

function AuthNavigator({ onAuthenticated }: { onAuthenticated: () => void }) {
  return (
    <AuthStack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.text, headerTitleStyle: { fontFamily: typography.fontFamily.bold, fontSize: 16 } }}>
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
    <OnboardingStack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.text, headerTitleStyle: { fontFamily: typography.fontFamily.bold, fontSize: 16 } }}>
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
    <Tabs.Navigator
      screenListeners={{
        tabPress: () => {
          haptic.selection();
        },
      }}
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontFamily: typography.fontFamily.bold, fontSize: 16, letterSpacing: 0.5 },
        tabBarStyle: {
          backgroundColor: 'rgba(255,255,255,0.94)',
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 0,
          shadowOpacity: 0,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: typography.fontFamily.regular,
          fontSize: 9,
          letterSpacing: 1.5,
          marginTop: 2,
        },
        tabBarIcon: ({ focused }) => {
          const icon = TAB_ICONS[route.name];
          return (
            <View style={tabStyles.iconWrap}>
              <Ionicons name={icon} size={20} color={focused ? colors.primary : colors.textMuted} />
              {focused ? <View style={tabStyles.activeBar} /> : null}
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Plan" component={PlanScreen} />
      <Tabs.Screen name="Practice" component={PracticeScreen} />
      <Tabs.Screen name="Progress" component={ProgressScreen} />
      <Tabs.Screen name="Settings" component={SettingsScreen} />
    </Tabs.Navigator>
  );
}

const tabStyles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    gap: 4,
  },
  activeBar: {
    width: 18,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
});

export function AppNavigator({ flow, onAuthenticated, onOnboardingComplete }: AppNavigatorProps) {
  return (
    <NavigationContainer>
      {flow === 'auth' && <AuthNavigator onAuthenticated={onAuthenticated} />}
      {flow === 'onboarding' && <OnboardingNavigator onDone={onOnboardingComplete} />}
      {flow === 'main' && (
        <MainStack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.text, headerTitleStyle: { fontFamily: typography.fontFamily.bold, fontSize: 16 } }}>
          <MainStack.Screen name="Tabs" component={MainTabs} options={{ headerShown: false }} />
          <MainStack.Screen
            name="DayDetail"
            component={DayDetailScreen}
            options={({ route }) => ({ title: `Day ${route.params.dayNumber}` })}
          />
          <MainStack.Screen name="Freestyle" component={FreestyleScreen} options={{ title: 'Freestyle' }} />
          <MainStack.Screen name="ScriptMode" component={ScriptModeScreen} options={{ title: 'Script Mode' }} />
          <MainStack.Screen name="Impromptu" component={ImpromptuScreen} options={{ title: 'Impromptu' }} />
          <MainStack.Screen name="Roleplay" component={RoleplayScreen} options={{ title: 'Roleplay' }} />
          <MainStack.Screen name="FillerSwap" component={FillerSwapScreen} options={{ title: 'Filler Swap' }} />
          <MainStack.Screen name="PausePunch" component={PausePunchScreen} options={{ title: 'Pause Punch' }} />
          <MainStack.Screen name="ABTBuilder" component={ABTBuilderScreen} options={{ title: 'ABT Builder' }} />
          <MainStack.Screen name="ClaritySprint" component={ClaritySprintScreen} options={{ title: 'Clarity Sprint' }} />
          <MainStack.Screen name="ExerciseRecord" component={ExerciseRecordScreen} options={{ title: 'Record' }} />
          <MainStack.Screen name="AnalysisResult" component={AnalysisResultScreen} options={{ title: 'Results' }} />
          <MainStack.Screen name="Paywall" component={PaywallScreen} options={{ presentation: 'modal', headerShown: false }} />
        </MainStack.Navigator>
      )}
    </NavigationContainer>
  );
}
