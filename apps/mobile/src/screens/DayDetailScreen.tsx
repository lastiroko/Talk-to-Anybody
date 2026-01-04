import { useMemo, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import planData from '../content/plan.v1.json';
import { PlanDay } from '../types/progress';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { useProgress } from '../hooks/useProgress';
import { MainStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export function DayDetailScreen() {
  const route = useRoute<RouteProp<MainStackParamList, 'DayDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { progress, loading, startDay, completeDay } = useProgress();
  const [working, setWorking] = useState(false);

  const plan = useMemo(() => planData as PlanDay[], []);
  const day = useMemo(() => plan.find((d) => d.dayNumber === route.params.dayNumber) as PlanDay, [plan, route.params.dayNumber]);

  const isLocked = progress ? day.dayNumber > progress.currentDayUnlocked : true;
  const isCompleted = progress?.completedDays.includes(day.dayNumber) ?? false;

  const handleStart = async () => {
    setWorking(true);
    await startDay();
    setWorking(false);
  };

  const handleComplete = async () => {
    setWorking(true);
    await completeDay(day.dayNumber);
    setWorking(false);
    navigation.goBack();
  };

  return (
    <ScreenContainer scroll={false}>
      {loading || !progress ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{day.title}</Text>
        <Text style={styles.objective}>{day.objective}</Text>
        <View style={styles.section}>
          <Text style={styles.heading}>Lesson</Text>
          <Text style={styles.body}>{day.lessonText}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Exercises</Text>
          {day.exercises.map((exercise) => (
            <View key={exercise.id} style={styles.exercise}>
              <Text style={styles.exerciseTitle}>{exercise.type.toUpperCase()}</Text>
              <Text style={styles.body}>{exercise.prompt}</Text>
              <Text style={styles.meta}>
                {exercise.durationSec}s · Targets: {exercise.targetMetrics.join(', ')}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.actions}>
          <PrimaryButton title="Start Day" onPress={handleStart} />
          <PrimaryButton
            title={isCompleted ? 'Completed' : 'Complete Day'}
            onPress={handleComplete}
            disabled={isLocked || isCompleted || working}
          />
          {isLocked && <Text style={styles.locked}>This day is locked. Finish previous days.</Text>}
        </View>
      </ScrollView>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
  },
  title: {
    fontSize: typography.heading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  objective: {
    fontSize: typography.subheading,
    color: colors.muted,
  },
  section: {
    gap: spacing.sm,
  },
  heading: {
    fontSize: typography.subheading,
    fontWeight: typography.weightSemi,
    color: colors.text,
  },
  body: {
    fontSize: typography.body,
    color: colors.text,
    lineHeight: 22,
  },
  exercise: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    gap: spacing.xs,
  },
  exerciseTitle: {
    fontSize: typography.body,
    fontWeight: typography.weightSemi,
    color: colors.text,
  },
  meta: {
    fontSize: typography.small,
    color: colors.muted,
  },
  actions: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  locked: {
    color: colors.muted,
  },
  loading: {
    marginTop: spacing.lg,
    color: colors.text,
  },
});
