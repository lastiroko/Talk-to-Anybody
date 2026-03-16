import { useMemo } from 'react';
import { Alert, Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PointsBadge } from '../components/PointsBadge';
import { ProgressBar } from '../components/ProgressBar';
import { SkeletonCard, SkeletonLine } from '../components/Skeleton';
import { useEntryAnimation } from '../hooks/useEntryAnimation';
import { useGamification } from '../hooks/useGamification';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';
import planData from '../content/plan.v1.json';
import { PlanDay } from '../types/progress';
import { useProgress } from '../hooks/useProgress';
import { usePaywallGate } from '../hooks/usePaywallGate';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';

type PlanNavigation = NativeStackNavigationProp<MainStackParamList>;

export function PlanScreen() {
  const { progress, loading } = useProgress();
  const navigation = useNavigation<PlanNavigation>();
  const { isGated } = usePaywallGate();
  const plan = useMemo(() => planData as PlanDay[], []);
  const { fadeIn } = useEntryAnimation(3);
  const gam = useGamification();

  const completedCount = progress?.completedDays.length ?? 0;
  const progressFraction = completedCount / 60;

  const weeks = useMemo(() => {
    const grouped: PlanDay[][] = [];
    plan.forEach((day) => {
      const weekIdx = Math.floor((day.dayNumber - 1) / 7);
      if (!grouped[weekIdx]) grouped[weekIdx] = [];
      grouped[weekIdx].push(day);
    });
    return grouped;
  }, [plan]);

  const getDayStatus = (dayNumber: number): 'completed' | 'current' | 'locked' => {
    if (progress?.completedDays.includes(dayNumber)) return 'completed';
    if (dayNumber === progress?.currentDayUnlocked) return 'current';
    if (progress && dayNumber <= progress.currentDayUnlocked) return 'completed';
    return 'locked';
  };

  const handleDayPress = (dayNumber: number) => {
    const status = getDayStatus(dayNumber);
    if (status === 'locked') {
      Alert.alert('Locked', `Complete Day ${progress?.currentDayUnlocked ?? 1} first`);
      return;
    }
    if (isGated({ dayNumber })) {
      navigation.navigate('Paywall');
      return;
    }
    navigation.navigate('DayDetail', { dayNumber });
  };

  if (loading || !progress) {
    return (
      <ScreenContainer>
        <View style={{ gap: spacing.md, padding: spacing.lg }}>
          <SkeletonLine width={200} />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false} scroll={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View style={[styles.header, fadeIn(0)]}>
          <Text style={styles.title}>Your Journey</Text>
          <PointsBadge gems={gam.gems} coins={gam.coins} />
        </Animated.View>

        {/* Progress card */}
        <Animated.View style={[styles.progressCard, shadows.card, fadeIn(1)]}>
          <View style={styles.progressTop}>
            <View style={styles.progressRing}>
              <Text style={styles.progressPercent}>{Math.round(progressFraction * 100)}%</Text>
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.progressDays}>Day {completedCount}/60</Text>
              <Text style={styles.progressSub}>{60 - completedCount} days remaining</Text>
              <View style={styles.progressBarWrap}>
                <ProgressBar progress={progressFraction} />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Week sections */}
        <Animated.View style={[styles.weeksList, fadeIn(2)]}>
          {weeks.map((weekDays, weekIdx) => (
            <View key={weekIdx} style={[styles.weekCard, shadows.card]}>
              <Text style={styles.weekTitle}>Week {weekIdx + 1}</Text>
              {weekDays.map((day) => {
                const status = getDayStatus(day.dayNumber);
                return (
                  <TouchableOpacity
                    key={day.dayNumber}
                    style={styles.dayRow}
                    onPress={() => handleDayPress(day.dayNumber)}
                    activeOpacity={status === 'locked' ? 1 : 0.7}
                  >
                    <View style={[
                      styles.dayCircle,
                      status === 'completed' && styles.dayCircleCompleted,
                      status === 'current' && styles.dayCircleCurrent,
                      status === 'locked' && styles.dayCircleLocked,
                    ]}>
                      <Text style={[
                        styles.dayCircleText,
                        status === 'completed' && { color: '#fff' },
                        status === 'current' && { color: '#fff' },
                      ]}>
                        {status === 'completed' ? '\u2713' : status === 'current' ? '\u25b6' : day.dayNumber}
                      </Text>
                    </View>
                    <View style={styles.dayInfo}>
                      <Text style={[styles.dayTitle, status === 'locked' && styles.dayTitleLocked]}>
                        {day.title}
                      </Text>
                      <Text style={styles.dayMeta}>~{day.estimatedMinutes} min</Text>
                    </View>
                    <Text style={styles.dayReward}>{'\ud83d\udc8e'}5</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: typography.title,
    fontWeight: typography.weightBold,
    color: colors.text,
  },

  // Progress card
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
  },
  progressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  progressRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 5,
    borderColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tealLight,
  },
  progressPercent: {
    fontSize: typography.heading,
    fontWeight: typography.weightBold,
    color: colors.teal,
  },
  progressInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  progressDays: {
    fontSize: typography.subheading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  progressSub: {
    fontSize: typography.small,
    color: colors.textMuted,
  },
  progressBarWrap: {
    marginTop: spacing.xs,
  },

  // Weeks
  weeksList: {
    gap: spacing.md,
  },
  weekCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.md,
    gap: 2,
  },
  weekTitle: {
    fontSize: typography.caption,
    fontWeight: typography.weightBold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    gap: spacing.md,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleCompleted: {
    backgroundColor: colors.success,
  },
  dayCircleCurrent: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  dayCircleLocked: {
    backgroundColor: colors.surfaceMuted,
  },
  dayCircleText: {
    fontSize: typography.caption,
    fontWeight: typography.weightBold,
    color: colors.textMuted,
  },
  dayInfo: {
    flex: 1,
    gap: 2,
  },
  dayTitle: {
    fontSize: typography.body,
    fontWeight: typography.weightSemi,
    color: colors.text,
  },
  dayTitleLocked: {
    color: colors.textMuted,
  },
  dayMeta: {
    fontSize: typography.tiny,
    color: colors.textMuted,
  },
  dayReward: {
    fontSize: typography.small,
    fontWeight: typography.weightBold,
    color: colors.gold,
  },

  bottomSpacer: { height: spacing.xl },
});
