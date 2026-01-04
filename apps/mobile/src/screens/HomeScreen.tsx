import { StyleSheet, Text, View } from 'react-native';
import { Text, StyleSheet, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { useProgress } from '../hooks/useProgress';
import { PrimaryButton } from '../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';

type HomeNavigation = NativeStackNavigationProp<MainStackParamList>;

export function HomeScreen() {
  const { progress, loading } = useProgress();
  const navigation = useNavigation<HomeNavigation>();

  const currentDay = progress?.currentDayUnlocked ?? 1;
  const currentStreak = progress?.currentStreak ?? 0;


export function HomeScreen() {
  return (
    <ScreenContainer>
      <View style={styles.section}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.subtitle}>Your daily plan and streak live here.</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today: Day {currentDay}</Text>
        <Text style={styles.meta}>Current streak: {currentStreak} day(s)</Text>
        <PrimaryButton
          title="Open today"
          onPress={() => navigation.navigate('DayDetail', { dayNumber: currentDay })}
          disabled={loading}
        />
        <Text style={styles.subtitle}>Today’s workout and quick stats will appear here.</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
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
  card: {
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    gap: spacing.md,
  },
  cardTitle: {
    fontSize: typography.subheading,
    fontWeight: typography.weightSemi,
    color: colors.text,
  },
  meta: {
    fontSize: typography.body,
    color: colors.muted,
  },
});
