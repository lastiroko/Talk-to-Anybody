import { useMemo } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PointsBadge } from '../components/PointsBadge';
import { XPBar } from '../components/XPBar';
import { StreakBadge } from '../components/StreakBadge';
import { ChallengeCard } from '../components/ChallengeCard';
import { CategoryPill } from '../components/CategoryPill';
import { PrimaryButton } from '../components/PrimaryButton';
import { EmptyState } from '../components/EmptyState';
import { SkeletonCard, SkeletonLine } from '../components/Skeleton';
import { useEntryAnimation } from '../hooks/useEntryAnimation';
import { useGamification } from '../hooks/useGamification';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';
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

const CATEGORIES = [
  { label: 'Pauses', color: colors.categoryBlue, icon: '\u23f8\ufe0f' },
  { label: 'Fillers', color: colors.categoryRed, icon: '\ud83d\udeab' },
  { label: 'Structure', color: colors.categoryPurple, icon: '\ud83d\udcda' },
  { label: 'Vocal', color: colors.categoryOrange, icon: '\ud83c\udfa4' },
  { label: 'Story', color: colors.categoryTeal, icon: '\ud83d\udcd6' },
];

export function HomeScreen() {
  const { progress, loading } = useProgress();
  const navigation = useNavigation<HomeNavigation>();
  const plan = useMemo(() => planData as PlanDay[], []);
  const { fadeIn } = useEntryAnimation(6);
  const gam = useGamification();

  const currentDay = progress?.currentDayUnlocked ?? 1;
  const currentStreak = progress?.currentStreak ?? 0;
  const completedCount = progress?.completedDays.length ?? 0;
  const todayData = useMemo(
    () => plan.find((d) => d.dayNumber === currentDay),
    [plan, currentDay],
  );
  const isTodayCompleted = progress?.completedDays.includes(currentDay) ?? false;
  const allCompleted = completedCount >= 60;

  if (loading || !progress) {
    return (
      <ScreenContainer>
        <View style={styles.topBar}>
          <SkeletonLine width={40} />
          <SkeletonLine width={120} />
        </View>
        <SkeletonCard />
        <SkeletonCard />
      </ScreenContainer>
    );
  }

  if (completedCount === 0 && currentDay === 1) {
    return (
      <ScreenContainer>
        <EmptyState
          icon={'\ud83d\udc4b'}
          title="Welcome!"
          subtitle="Let's begin with your baseline recording"
          action={{
            label: 'Get Started',
            onPress: () => navigation.navigate('DayDetail', { dayNumber: 1 }),
          }}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false} scroll={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Top bar: avatar + points */}
        <Animated.View style={[styles.topBar, fadeIn(0)]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {'\ud83d\udc64'}
            </Text>
          </View>
          <PointsBadge gems={gam.gems} coins={gam.coins} />
        </Animated.View>

        {/* XP bar */}
        <Animated.View style={fadeIn(1)}>
          <XPBar current={gam.xpInLevel} target={gam.xpToNextLevel} level={gam.level} />
        </Animated.View>

        {/* Greeting + streak */}
        <Animated.View style={[styles.greetingRow, fadeIn(2)]}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          {currentStreak > 0 ? <StreakBadge count={currentStreak} /> : null}
        </Animated.View>

        {/* Today's challenge card or graduation */}
        <Animated.View style={fadeIn(3)}>
          {allCompleted ? (
            <View style={[styles.gradCard, shadows.card]}>
              <Text style={styles.gradEmoji}>{'\ud83c\udf93'}</Text>
              <Text style={styles.gradTitle}>Congratulations!</Text>
              <Text style={styles.gradSub}>
                You've completed all 60 days. You're a speaking champion!
              </Text>
            </View>
          ) : todayData ? (
            <ChallengeCard
              title={todayData.title}
              subtitle={todayData.objective}
              progress={`Day ${todayData.dayNumber}/60`}
              gems={5}
              coins={100}
              icon={isTodayCompleted ? '\u2705' : '\ud83c\udfa4'}
              onPress={() => navigation.navigate('DayDetail', { dayNumber: currentDay })}
            />
          ) : null}
        </Animated.View>

        {/* Quick categories */}
        <Animated.View style={fadeIn(4)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
            {CATEGORIES.map((cat) => (
              <CategoryPill key={cat.label} label={cat.label} color={cat.color} icon={cat.icon} />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Mini-game spotlight */}
        <Animated.View style={fadeIn(5)}>
          <TouchableOpacity style={[styles.spotlightCard, shadows.card]} activeOpacity={0.8}>
            <View style={styles.spotlightIconCircle}>
              <Text style={styles.spotlightIcon}>{'\ud83c\udfae'}</Text>
            </View>
            <View style={styles.spotlightText}>
              <Text style={styles.spotlightTitle}>Daily Quiz</Text>
              <Text style={styles.spotlightSub}>Your daily challenge is waiting!</Text>
            </View>
            <View style={styles.spotlightReward}>
              <Text style={styles.spotlightRewardText}>{'\ud83d\udc8e'}+5</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Continue Practice */}
        <PrimaryButton
          title="Continue Practice"
          variant="secondary"
          onPress={() => {}}
        />

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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    fontSize: typography.title,
    fontWeight: typography.weightBold,
    color: colors.text,
  },

  // Graduation
  gradCard: {
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 18,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  gradEmoji: { fontSize: 48 },
  gradTitle: {
    fontSize: typography.heading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  gradSub: {
    fontSize: typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Categories
  categoriesRow: {
    gap: spacing.sm,
    paddingVertical: 2,
  },

  // Spotlight
  spotlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
    gap: spacing.md,
  },
  spotlightIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.gameBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spotlightIcon: { fontSize: 24 },
  spotlightText: { flex: 1, gap: 2 },
  spotlightTitle: {
    fontSize: typography.body,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  spotlightSub: {
    fontSize: typography.small,
    color: colors.textMuted,
  },
  spotlightReward: {
    backgroundColor: colors.goldLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  spotlightRewardText: {
    fontSize: typography.small,
    fontWeight: typography.weightBold,
    color: colors.gold,
  },

  bottomSpacer: { height: spacing.xl },
});
