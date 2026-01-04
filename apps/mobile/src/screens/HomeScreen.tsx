import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { useProgress } from '../hooks/useProgress';
import { PrimaryButton } from '../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';

type HomeNav = NativeStackNavigationProp<MainStackParamList>;

export function HomeScreen() {
  const { progress, loading } = useProgress();
  const navigation = useNavigation<HomeNav>();

  const todayDay = progress?.currentDayUnlocked ?? 1;

  if (loading || !progress) {
    return (
      <ScreenContainer>
        <Text style={styles.loading}>Loading...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.section}>
        <Text style={styles.title}>Today</Text>
        <View style={styles.card}>
          <Text style={styles.dayLabel}>Day {todayDay}</Text>
          <Text style={styles.subtitle}>Tap to view lesson and exercises.</Text>
          <PrimaryButton title="Open today" onPress={() => navigation.navigate('DayDetail', { dayNumber: todayDay })} />
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Streak</Text>
        <Text style={styles.subtitle}>
          Current streak: {progress.currentStreak} | Last practice: {progress.lastPracticeDate ?? '—'}
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
    marginTop: spacing.lg,
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
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  dayLabel: {
    fontSize: typography.subheading,
    fontWeight: typography.weightSemi,
    color: colors.text,
  },
  loading: {
    marginTop: spacing.lg,
    color: colors.text,
  },
});
