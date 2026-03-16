import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { PointsBadge } from '../components/PointsBadge';
import { ExerciseCard } from '../components/ExerciseCard';
import { AnxietyRater } from '../components/AnxietyRater';
import { Celebration } from '../components/Celebration';
import { ScrollHeader } from '../components/ScrollHeader';
import { SkeletonCard, SkeletonLine } from '../components/Skeleton';
import { useEntryAnimation } from '../hooks/useEntryAnimation';
import { useGamification } from '../hooks/useGamification';
import planData from '../content/plan.v1.json';
import { PlanDay } from '../types/progress';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';
import { useProgress } from '../hooks/useProgress';
import { usePaywallGate } from '../hooks/usePaywallGate';
import { MainStackParamList } from '../navigation/types';
import { haptic } from '../utils/haptics';

export function DayDetailScreen() {
  const route = useRoute<RouteProp<MainStackParamList, 'DayDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { progress, loading, completeDay } = useProgress();
  const { isGated } = usePaywallGate();
  const gam = useGamification();

  const plan = useMemo(() => planData as PlanDay[], []);
  const day = useMemo(
    () => plan.find((d) => d.dayNumber === route.params.dayNumber) as PlanDay,
    [plan, route.params.dayNumber],
  );
  const nextDay = useMemo(
    () => plan.find((d) => d.dayNumber === route.params.dayNumber + 1),
    [plan, route.params.dayNumber],
  );

  const isCompleted = progress?.completedDays.includes(day.dayNumber) ?? false;

  const [completedExercises, setCompletedExercises] = useState<Set<string>>(
    () => new Set(isCompleted ? day.exercises.map((e) => e.id) : []),
  );
  const [preRating, setPreRating] = useState<number | null>(null);
  const [postRating, setPostRating] = useState<number | null>(null);
  const [working, setWorking] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const exerciseCount = day.exercises.length;
  const { fadeIn } = useEntryAnimation(3 + exerciseCount);

  const allExercisesDone = day.exercises.every((e) => completedExercises.has(e.id));
  const showPreRating = day.anxietyGate?.showPreRating ?? false;
  const showPostRating = day.anxietyGate?.showPostRating ?? false;

  const handleExerciseStart = (exerciseId: string) => {
    const exercise = day.exercises.find((e) => e.id === exerciseId);
    if (exercise && (exercise.type === 'record' || exercise.type === 'drill' || exercise.type === 'imitation_drill')) {
      navigation.navigate('ExerciseRecord', { exercise, dayNumber: day.dayNumber });
    } else {
      haptic.light();
      setCompletedExercises((prev) => {
        const next = new Set(prev);
        next.add(exerciseId);
        return next;
      });
    }
  };

  useEffect(() => {
    const completedId = route.params.completedExerciseId;
    if (completedId) {
      setCompletedExercises((prev) => {
        const next = new Set(prev);
        next.add(completedId);
        return next;
      });
      navigation.setParams({ completedExerciseId: undefined });
    }
  }, [route.params.completedExerciseId, navigation]);

  const handleComplete = async () => {
    if (!allExercisesDone) return;
    setWorking(true);
    await completeDay(day.dayNumber);
    setWorking(false);
    setJustCompleted(true);
    haptic.success();
  };

  const difficulty = Math.min(5, Math.max(1, Math.ceil(day.dayNumber / 12)));

  if (loading || !progress) {
    return (
      <ScreenContainer>
        <View style={{ gap: spacing.lg }}>
          <SkeletonLine width={120} />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </ScreenContainer>
    );
  }

  if (isGated({ dayNumber: route.params.dayNumber })) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <Text style={styles.gatedIcon}>{'\ud83d\udd12'}</Text>
          <Text style={styles.gatedTitle}>This day requires a subscription</Text>
          <Text style={styles.gatedSubtitle}>
            Unlock the full 60-day plan to access Day {route.params.dayNumber} and beyond.
          </Text>
          <PrimaryButton title="View Plans" onPress={() => navigation.navigate('Paywall')} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll={false}>
      <Celebration trigger={justCompleted} variant="confetti" />
      <ScrollHeader title={day.title} scrollY={scrollY} />
      <Animated.ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        {/* Hero card */}
        <Animated.View style={[styles.heroCard, shadows.card, fadeIn(0)]}>
          <View style={styles.heroHeader}>
            <View style={styles.dayBadge}>
              <Text style={styles.dayBadgeText}>Day {day.dayNumber}</Text>
            </View>
            <PointsBadge gems={5} coins={100} />
          </View>
          <Text style={styles.heroTitle}>{day.title}</Text>
          <Text style={styles.heroObjective}>{day.objective}</Text>
          <View style={styles.difficultyRow}>
            {Array.from({ length: 5 }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.difficultyDot,
                  i < difficulty ? styles.difficultyFilled : styles.difficultyEmpty,
                ]}
              />
            ))}
            <Text style={styles.difficultyLabel}>Difficulty</Text>
          </View>
        </Animated.View>

        {/* Pre-rating */}
        {showPreRating && !isCompleted ? (
          <View style={[styles.raterCard, shadows.card]}>
            <AnxietyRater
              label="How anxious do you feel right now?"
              value={preRating}
              onChange={setPreRating}
            />
          </View>
        ) : null}

        {/* Lesson card with colored left stripe */}
        <Animated.View style={[styles.lessonCard, shadows.card, fadeIn(1)]}>
          <View style={styles.lessonStripe} />
          <View style={styles.lessonContent}>
            <Text style={styles.lessonLabel}>{'\ud83d\udcd6'} Lesson</Text>
            <Text style={styles.lessonText}>{day.lessonText}</Text>
          </View>
        </Animated.View>

        {/* Exercise list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Exercises ({completedExercises.size}/{day.exercises.length})
          </Text>
          {day.exercises.map((exercise, idx) => (
            <Animated.View key={exercise.id} style={fadeIn(2 + idx)}>
              <ExerciseCard
                exercise={exercise}
                isCompleted={completedExercises.has(exercise.id)}
                onStart={() => handleExerciseStart(exercise.id)}
              />
            </Animated.View>
          ))}
        </View>

        {/* Games section */}
        {day.games && day.games.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{'\ud83c\udfae'} Mini-Games Unlocked</Text>
            <View style={styles.gamesRow}>
              {day.games.map((game) => (
                <View key={game} style={styles.gamePill}>
                  <Text style={styles.gamePillText}>{game}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Post-rating */}
        {showPostRating && !isCompleted ? (
          <View style={[styles.raterCard, shadows.card]}>
            <AnxietyRater
              label="How do you feel now?"
              value={postRating}
              onChange={setPostRating}
            />
          </View>
        ) : null}

        {/* Complete button */}
        {!isCompleted && !justCompleted ? (
          <PrimaryButton
            title={`Complete Day ${day.dayNumber}`}
            onPress={handleComplete}
            disabled={!allExercisesDone || working}
          />
        ) : null}

        {/* Just completed celebration */}
        {justCompleted ? (
          <View style={[styles.celebration, shadows.card]}>
            <Text style={styles.celebrationEmoji}>{'\ud83c\udf89'}</Text>
            <Text style={styles.celebrationTitle}>
              Day {day.dayNumber} complete!
            </Text>
            <View style={styles.rewardRow}>
              <Text style={styles.rewardText}>{'\ud83d\udc8e'}+5  {'\ud83e\ude99'}+100  +50 XP</Text>
            </View>
            <Text style={styles.celebrationSub}>Great work! Keep the momentum going.</Text>
            {nextDay ? (
              <TouchableOpacity
                style={[styles.nextDayCard, shadows.soft]}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Text style={styles.nextDayLabel}>Up next:</Text>
                <Text style={styles.nextDayTitle}>
                  Day {nextDay.dayNumber} — {nextDay.title}
                </Text>
              </TouchableOpacity>
            ) : null}
            <PrimaryButton title="Back to Home" onPress={() => navigation.goBack()} />
          </View>
        ) : null}

        {/* Already completed state */}
        {isCompleted && !justCompleted ? (
          <View style={styles.alreadyCompleted}>
            <Text style={styles.completedBadge}>{'\u2713'} Day completed</Text>
            {nextDay ? (
              <Text style={styles.nextDayHint}>
                Up next: Day {nextDay.dayNumber} — {nextDay.title}
              </Text>
            ) : null}
          </View>
        ) : null}

        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },

  // Hero card
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
    gap: spacing.md,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  dayBadgeText: {
    color: '#fff',
    fontSize: typography.small,
    fontWeight: typography.weightBold,
  },
  heroTitle: {
    fontSize: typography.title,
    fontWeight: typography.weightBold,
    color: colors.text,
    lineHeight: 32,
  },
  heroObjective: {
    fontSize: typography.body,
    color: colors.textBody,
    lineHeight: 22,
  },
  difficultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  difficultyDot: { width: 10, height: 10, borderRadius: 5 },
  difficultyFilled: { backgroundColor: colors.gold },
  difficultyEmpty: { backgroundColor: colors.border },
  difficultyLabel: {
    fontSize: typography.small,
    color: colors.textMuted,
    marginLeft: 4,
  },

  // Lesson card
  lessonCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  lessonStripe: {
    width: 5,
    backgroundColor: colors.gold,
  },
  lessonContent: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  lessonLabel: {
    fontSize: typography.caption,
    fontWeight: typography.weightBold,
    color: colors.gold,
  },
  lessonText: {
    fontSize: typography.body,
    color: colors.text,
    lineHeight: 24,
  },

  // Rater card
  raterCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
  },

  // Section
  section: { gap: spacing.md },
  sectionTitle: {
    fontSize: typography.subheading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },

  // Games
  gamesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gamePill: {
    backgroundColor: colors.gameBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  gamePillText: {
    fontSize: typography.small,
    fontWeight: typography.weightSemi,
    color: '#16a34a',
  },

  // Celebration
  celebration: {
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 18,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  celebrationEmoji: { fontSize: 48 },
  celebrationTitle: {
    fontSize: typography.heading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  rewardRow: {
    backgroundColor: colors.goldLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  rewardText: {
    fontSize: typography.body,
    fontWeight: typography.weightBold,
    color: colors.gold,
  },
  celebrationSub: {
    fontSize: typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  nextDayCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    width: '100%',
    gap: 4,
  },
  nextDayLabel: {
    fontSize: typography.small,
    color: colors.textMuted,
  },
  nextDayTitle: {
    fontSize: typography.body,
    fontWeight: typography.weightSemi,
    color: colors.text,
  },

  // Already completed
  alreadyCompleted: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  completedBadge: {
    fontSize: typography.subheading,
    fontWeight: typography.weightBold,
    color: '#16a34a',
  },
  nextDayHint: {
    fontSize: typography.body,
    color: colors.textMuted,
  },

  bottomSpacer: { height: spacing.xl },

  // Gated
  gatedIcon: { fontSize: 48, marginBottom: spacing.md },
  gatedTitle: {
    fontSize: typography.subheading,
    fontWeight: typography.weightBold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  gatedSubtitle: {
    fontSize: typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
});
