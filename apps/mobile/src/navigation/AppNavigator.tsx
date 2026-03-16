import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { haptic } from '../utils/haptics';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
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

const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
  Home: { active: '\ud83c\udfe0', inactive: '\ud83c\udfe0' },
  Plan: { active: '\ud83d\udccb', inactive: '\ud83d\udccb' },
  Practice: { active: '\ud83c\udf99\ufe0f', inactive: '\ud83c\udf99\ufe0f' },
  Progress: { active: '\ud83d\udcca', inactive: '\ud83d\udcca' },
  Settings: { active: '\u2699\ufe0f', inactive: '\u2699\ufe0f' },
};

function AuthNavigator({ onAuthenticated }: { onAuthenticated: () => void }) {
  return (
    <AuthStack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.text }}>
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
    <OnboardingStack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.text }}>
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
        tabBarStyle: {
          backgroundColor: colors.tabBg,
          borderTopColor: colors.divider,
          height: 60,
          paddingBottom: 6,
        },
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: {
          fontSize: typography.tiny,
          fontWeight: '600' as const,
        },
        tabBarIcon: ({ focused }) => {
          const icons = TAB_ICONS[route.name];
          return (
            <View style={tabStyles.iconWrap}>
              <Text style={{ fontSize: 20 }}>{focused ? icons.active : icons.inactive}</Text>
              {focused ? <View style={tabStyles.activeDot} /> : null}
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
    gap: 2,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
  },
});

export function AppNavigator({ flow, onAuthenticated, onOnboardingComplete }: AppNavigatorProps) {
  return (
    <NavigationContainer>
      {flow === 'auth' && <AuthNavigator onAuthenticated={onAuthenticated} />}
      {flow === 'onboarding' && <OnboardingNavigator onDone={onOnboardingComplete} />}
      {flow === 'main' && (
        <MainStack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.text }}>
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
