import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PlanExercise } from '../types/progress';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface ExerciseCardProps {
  exercise: PlanExercise;
  isCompleted: boolean;
  onStart: () => void;
}

const TYPE_CONFIG: Record<string, { bg: string; border: string; label: string }> = {
  record: { bg: '#dbeafe', border: '#93c5fd', label: 'Record' },
  drill: { bg: '#ffedd5', border: '#fdba74', label: 'Drill' },
  reflection: { bg: '#f3e8ff', border: '#c4b5fd', label: 'Reflection' },
  game: { bg: '#dcfce7', border: '#86efac', label: 'Game' },
  unlearning_drill: { bg: '#ffe4e6', border: '#fda4af', label: 'Unlearning' },
  imitation_drill: { bg: '#ccfbf1', border: '#5eead4', label: 'Imitation' },
};

export function ExerciseCard({ exercise, isCompleted, onStart }: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = TYPE_CONFIG[exercise.type] ?? {
    bg: colors.surface,
    border: colors.border,
    label: exercise.type,
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: config.bg, borderColor: config.border },
        isCompleted && styles.completedCard,
      ]}
    >
      {isCompleted && (
        <View style={styles.checkOverlay}>
          <Text style={styles.checkText}>{'\u2713'}</Text>
        </View>
      )}

      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: config.border }]}>
          <Text style={styles.badgeText}>{config.label}</Text>
        </View>
        <Text style={styles.duration}>{exercise.durationSec}s</Text>
      </View>

      <Text style={styles.prompt}>{exercise.prompt}</Text>

      {exercise.instructions ? (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.toggle}>
            {expanded ? 'Hide instructions' : 'Show instructions'}
          </Text>
        </TouchableOpacity>
      ) : null}

      {expanded && exercise.instructions ? (
        <Text style={styles.instructions}>{exercise.instructions}</Text>
      ) : null}

      {!isCompleted ? (
        <TouchableOpacity style={styles.startButton} onPress={onStart} activeOpacity={0.7}>
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1.5,
    padding: spacing.md,
    gap: spacing.sm,
    position: 'relative',
    overflow: 'hidden',
  },
  completedCard: {
    opacity: 0.75,
  },
  checkOverlay: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  checkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: typography.weightBold,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 32,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: typography.small,
    fontWeight: typography.weightSemi,
    color: '#fff',
  },
  duration: {
    fontSize: typography.small,
    fontWeight: typography.weightSemi,
    color: colors.muted,
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  prompt: {
    fontSize: typography.body,
    color: colors.text,
    lineHeight: 22,
  },
  toggle: {
    fontSize: typography.small,
    color: colors.primary,
    fontWeight: typography.weightSemi,
  },
  instructions: {
    fontSize: typography.small,
    color: colors.muted,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginTop: 4,
  },
  startButtonText: {
    color: '#fff',
    fontSize: typography.body,
    fontWeight: typography.weightSemi,
  },
});
