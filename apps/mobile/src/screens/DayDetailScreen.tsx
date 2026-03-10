import { useMemo, useState } from 'react';
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
import { ExerciseCard } from '../components/ExerciseCard';
import { AnxietyRater } from '../components/AnxietyRater';
import planData from '../content/plan.v1.json';
import { PlanDay } from '../types/progress';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { useProgress } from '../hooks/useProgress';
import { MainStackParamList } from '../navigation/types';

export function DayDetailScreen() {
  const route = useRoute<RouteProp<MainStackParamList, 'DayDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { progress, loading, completeDay } = useProgress();

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

  // Local exercise completion tracking
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(
    () => new Set(isCompleted ? day.exercises.map((e) => e.id) : []),
  );
  const [preRating, setPreRating] = useState<number | null>(null);
  const [postRating, setPostRating] = useState<number | null>(null);
  const [working, setWorking] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  const allExercisesDone = day.exercises.every((e) => completedExercises.has(e.id));
  const showPreRating = day.anxietyGate?.showPreRating ?? false;
  const showPostRating = day.anxietyGate?.showPostRating ?? false;

  const handleExerciseStart = (exerciseId: string) => {
    setCompletedExercises((prev) => {
      const next = new Set(prev);
      next.add(exerciseId);
      return next;
    });
  };

  const handleComplete = async () => {
    if (!allExercisesDone) return;
    setWorking(true);
    await completeDay(day.dayNumber);
    setWorking(false);
    setJustCompleted(true);
  };

  // Difficulty dots
  const difficulty = Math.min(5, Math.max(1, Math.ceil(day.dayNumber / 12)));

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
    <ScreenContainer scroll={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Day header */}
        <View style={styles.dayHeader}>
          <View style={styles.dayBadge}>
            <Text style={styles.dayBadgeText}>Day {day.dayNumber}</Text>
          </View>
          <Text style={styles.title}>{day.title}</Text>
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
        </View>

        {/* Objective */}
        <View style={styles.objectiveCard}>
          <Text style={styles.objectiveLabel}>Objective</Text>
          <Text style={styles.objectiveText}>{day.objective}</Text>
        </View>

        {/* Pre-rating */}
        {showPreRating && !isCompleted ? (
          <AnxietyRater
            label="How anxious do you feel right now?"
            value={preRating}
            onChange={setPreRating}
          />
        ) : null}

        {/* Lesson card */}
        <View style={styles.lessonCard}>
          <Text style={styles.lessonLabel}>{'\ud83d\udcd6'} Lesson</Text>
          <Text style={styles.lessonText}>{day.lessonText}</Text>
        </View>

        {/* Exercise list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Exercises ({completedExercises.size}/{day.exercises.length})
          </Text>
          {day.exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              isCompleted={completedExercises.has(exercise.id)}
              onStart={() => handleExerciseStart(exercise.id)}
            />
          ))}
        </View>

        {/* Games section */}
        {day.games && day.games.length > 0 ? (
          <View style={styles.gamesSection}>
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
          <AnxietyRater
            label="How do you feel now?"
            value={postRating}
            onChange={setPostRating}
          />
        ) : null}

        {/* Complete button */}
        {!isCompleted && !justCompleted ? (
          <PrimaryButton
            title={`Complete Day ${day.dayNumber} \u2192`}
            onPress={handleComplete}
            disabled={!allExercisesDone || working}
          />
        ) : null}

        {/* Just completed celebration */}
        {justCompleted ? (
          <View style={styles.celebration}>
            <Text style={styles.celebrationEmoji}>{'\ud83c\udf89'}</Text>
            <Text style={styles.celebrationTitle}>
              Day {day.dayNumber} complete!
            </Text>
            <Text style={styles.celebrationSub}>Great work! Keep the momentum going.</Text>
            {nextDay ? (
              <TouchableOpacity
                style={styles.nextDayCard}
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
      </ScrollView>
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
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },

  // Day header
  dayHeader: {
    gap: spacing.sm,
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
  title: {
    fontSize: 28,
    fontWeight: typography.weightBold,
    color: colors.text,
    lineHeight: 34,
  },
  difficultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  difficultyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  difficultyFilled: {
    backgroundColor: '#f59e0b',
  },
  difficultyEmpty: {
    backgroundColor: colors.border,
  },
  difficultyLabel: {
    fontSize: typography.small,
    color: colors.muted,
    marginLeft: 4,
  },

  // Objective
  objectiveCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  objectiveLabel: {
    fontSize: typography.small,
    fontWeight: typography.weightSemi,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  objectiveText: {
    fontSize: typography.body,
    color: colors.text,
    lineHeight: 22,
  },

  // Lesson
  lessonCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  lessonLabel: {
    fontSize: typography.small,
    fontWeight: typography.weightSemi,
    color: colors.primary,
  },
  lessonText: {
    fontSize: typography.body,
    color: colors.text,
    lineHeight: 24,
  },

  // Exercises section
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.subheading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },

  // Games
  gamesSection: {
    gap: spacing.sm,
  },
  gamesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gamePill: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  gamePillText: {
    fontSize: typography.small,
    fontWeight: typography.weightSemi,
    color: '#16a34a',
  },

  // Celebration
  celebration: {
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  celebrationEmoji: {
    fontSize: 48,
  },
  celebrationTitle: {
    fontSize: typography.heading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  celebrationSub: {
    fontSize: typography.body,
    color: colors.muted,
    textAlign: 'center',
  },
  nextDayCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: spacing.md,
    width: '100%',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nextDayLabel: {
    fontSize: typography.small,
    color: colors.muted,
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
    color: colors.muted,
  },

  bottomSpacer: {
    height: spacing.xl,
  },
});
