import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PlanExercise } from '../types/progress';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

interface ExerciseCardProps {
  exercise: PlanExercise;
  isCompleted: boolean;
  onStart: () => void;
}

const TYPE_CONFIG: Record<string, { bg: string; circleColor: string; label: string; icon: string }> = {
  record: { bg: 'rgba(255,69,0,0.12)', circleColor: '#FF4500', label: 'Record', icon: '\ud83c\udfa4' },
  drill: { bg: 'rgba(250,204,21,0.12)', circleColor: '#FACC15', label: 'Drill', icon: '\ud83c\udfaf' },
  reflection: { bg: 'rgba(168,85,247,0.12)', circleColor: '#A855F7', label: 'Reflection', icon: '\ud83e\udde0' },
  game: { bg: 'rgba(74,222,128,0.12)', circleColor: '#4ADE80', label: 'Game', icon: '\ud83c\udfae' },
  unlearning_drill: { bg: 'rgba(230,57,70,0.12)', circleColor: '#E63946', label: 'Unlearning', icon: '\ud83d\udd04' },
  imitation_drill: { bg: 'rgba(45,212,191,0.12)', circleColor: '#2DD4BF', label: 'Imitation', icon: '\ud83d\udc42' },
};

export function ExerciseCard({ exercise, isCompleted, onStart }: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = TYPE_CONFIG[exercise.type] ?? {
    bg: colors.surfaceMuted,
    circleColor: colors.primary,
    label: exercise.type,
    icon: '\u2022',
  };

  return (
    <View style={[styles.card, shadows.card, isCompleted && styles.completedCard]}>
      {isCompleted && (
        <View style={styles.checkOverlay}>
          <Text style={styles.checkText}>{'\u2713'}</Text>
        </View>
      )}

      <View style={styles.row}>
        <View style={[styles.iconCircle, { backgroundColor: config.circleColor }]}>
          <Text style={styles.iconText}>{config.icon}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={[styles.badge, { backgroundColor: config.bg }]}>
              <Text style={[styles.badgeText, { color: config.circleColor }]}>{config.label}</Text>
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
        </View>
      </View>

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
    backgroundColor: '#141414',
    borderRadius: 18,
    padding: spacing.md,
    gap: spacing.sm,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  completedCard: {
    opacity: 0.7,
  },
  checkOverlay: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  checkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: typography.weightBold,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  iconText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    gap: spacing.xs,
    paddingRight: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: typography.tiny,
    fontWeight: typography.weightBold,
  },
  duration: {
    fontSize: typography.small,
    fontWeight: typography.weightSemi,
    color: '#8A8A8A',
  },
  prompt: {
    fontSize: typography.body,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  toggle: {
    fontSize: typography.small,
    color: '#FF4500',
    fontWeight: typography.weightSemi,
  },
  instructions: {
    fontSize: typography.small,
    color: '#8A8A8A',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
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
