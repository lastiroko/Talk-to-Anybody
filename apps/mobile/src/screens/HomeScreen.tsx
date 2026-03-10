import { useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { StatCard } from '../components/StatCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { useProgress } from '../hooks/useProgress';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import planData from '../content/plan.v1.json';
import { PlanDay } from '../types/progress';

type HomeNavigation = NativeStackNavigationProp<MainStackParamList>;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning!';
  if (hour < 17) return 'Good afternoon!';
  return 'Good evening!';
}

export function HomeScreen() {
  const { progress, loading } = useProgress();
  const navigation = useNavigation<HomeNavigation>();
  const plan = useMemo(() => planData as PlanDay[], []);

  const currentDay = progress?.currentDayUnlocked ?? 1;
  const currentStreak = progress?.currentStreak ?? 0;
  const completedCount = progress?.completedDays.length ?? 0;
  const todayData = useMemo(
    () => plan.find((d) => d.dayNumber === currentDay),
    [plan, currentDay],
  );
  const isTodayCompleted = progress?.completedDays.includes(currentDay) ?? false;
  const allCompleted = completedCount >= 60;

  const avgMinutes = 4;
  const totalPracticeMin = completedCount * avgMinutes;

  if (loading || !progress) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      {/* Greeting bar */}
      <View style={styles.greetingBar}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakFlame}>{'\ud83d\udd25'}</Text>
          <Text style={styles.streakCount}>{currentStreak}</Text>
        </View>
      </View>

      {/* Today's card or graduation */}
      {allCompleted ? (
        <View style={styles.gradCard}>
          <Text style={styles.gradEmoji}>{'\ud83c\udf93'}</Text>
          <Text style={styles.gradTitle}>Congratulations!</Text>
          <Text style={styles.gradSub}>
            You've completed all 60 days. You're a speaking champion!
          </Text>
        </View>
      ) : todayData ? (
        <View style={styles.todayCard}>
          <View style={styles.dayBadge}>
            <Text style={styles.dayBadgeText}>Day {todayData.dayNumber}</Text>
          </View>
          <Text style={styles.todayTitle}>{todayData.title}</Text>
          <Text style={styles.todayObjective}>{todayData.objective}</Text>
          <View style={styles.minPill}>
            <Text style={styles.minPillText}>~{todayData.estimatedMinutes} min</Text>
          </View>
          {isTodayCompleted ? (
            <View style={styles.completedRow}>
              <Text style={styles.completedText}>{'\u2713'} Completed!</Text>
              <PrimaryButton
                title="Review"
                onPress={() =>
                  navigation.navigate('DayDetail', { dayNumber: currentDay })
                }
              />
            </View>
          ) : (
            <PrimaryButton
              title="Start Today's Workout"
              onPress={() =>
                navigation.navigate('DayDetail', { dayNumber: currentDay })
              }
            />
          )}
        </View>
      ) : null}

      {/* Quick stats row */}
      <View style={styles.statsRow}>
        <StatCard label="Completed" value={`${completedCount}/60`} icon={'\ud83d\udcca'} />
        <StatCard label="Streak" value={`${currentStreak} days`} icon={'\ud83d\udd25'} />
        <StatCard label="Practice" value={`${totalPracticeMin} min`} icon={'\u23f1\ufe0f'} />
      </View>

      {/* SRS review banner */}
      {currentDay > 7 && !allCompleted ? (
        <TouchableOpacity style={styles.reviewBanner} activeOpacity={0.8}>
          <View style={styles.reviewBannerLeft}>
            <Text style={styles.reviewIcon}>{'\ud83d\udcdd'}</Text>
            <Text style={styles.reviewBannerText}>
              You have review drills due
            </Text>
          </View>
          <Text style={styles.reviewButton}>Review</Text>
        </TouchableOpacity>
      ) : null}

      {/* Continue Practice */}
      <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
        <Text style={styles.secondaryButtonText}>Continue Practice</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: typography.body,
    color: colors.muted,
  },
  greetingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: typography.heading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  streakFlame: {
    fontSize: 18,
  },
  streakCount: {
    fontSize: typography.body,
    fontWeight: typography.weightBold,
    color: '#ea580c',
  },

  // Today's card
  todayCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  dayBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  dayBadgeText: {
    color: '#fff',
    fontSize: typography.small,
    fontWeight: typography.weightBold,
  },
  todayTitle: {
    fontSize: typography.heading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  todayObjective: {
    fontSize: typography.body,
    color: colors.muted,
    lineHeight: 22,
  },
  minPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  minPillText: {
    fontSize: typography.small,
    fontWeight: typography.weightSemi,
    color: colors.primary,
  },
  completedRow: {
    gap: spacing.sm,
  },
  completedText: {
    fontSize: typography.body,
    fontWeight: typography.weightSemi,
    color: '#16a34a',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },

  // Graduation
  gradCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: '#fcd34d',
    marginBottom: spacing.lg,
  },
  gradEmoji: {
    fontSize: 48,
  },
  gradTitle: {
    fontSize: typography.heading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  gradSub: {
    fontSize: typography.body,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },

  // SRS banner
  reviewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#fcd34d',
    marginBottom: spacing.lg,
  },
  reviewBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  reviewIcon: {
    fontSize: 18,
  },
  reviewBannerText: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: typography.weightSemi,
  },
  reviewButton: {
    fontSize: typography.body,
    color: colors.primary,
    fontWeight: typography.weightBold,
  },

  // Secondary button
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: typography.body,
    fontWeight: typography.weightSemi,
    color: colors.primary,
  },
});
