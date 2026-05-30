import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PlanExercise } from '../types/progress';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface ExerciseCardProps {
  exercise: PlanExercise;
  isCompleted: boolean;
  onStart: () => void;
}

const TYPE_CONFIG: Record<string, { bg: string; circleColor: string; label: string; icon: IoniconName }> = {
  record: { bg: colors.recordBg, circleColor: colors.primary, label: 'Record', icon: 'mic-outline' },
  drill: { bg: colors.drillBg, circleColor: colors.butter, label: 'Drill', icon: 'locate-outline' },
  reflection: { bg: colors.imitationBg, circleColor: colors.lavender, label: 'Reflection', icon: 'bulb-outline' },
  game: { bg: colors.gameBg, circleColor: colors.success, label: 'Game', icon: 'game-controller-outline' },
  unlearning_drill: { bg: colors.unlearningBg, circleColor: colors.error, label: 'Unlearning', icon: 'refresh-outline' },
  imitation_drill: { bg: 'rgba(126,217,181,0.16)', circleColor: colors.teal, label: 'Imitation', icon: 'ear-outline' },
};

export function ExerciseCard({ exercise, isCompleted, onStart }: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = TYPE_CONFIG[exercise.type] ?? {
    bg: colors.surfaceMuted,
    circleColor: colors.primary,
    label: exercise.type,
    icon: 'ellipse-outline' as IoniconName,
  };

  return (
    <View style={[styles.card, shadows.card, isCompleted && styles.completedCard]}>
      {isCompleted && (
        <View style={styles.checkOverlay}>
          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
        </View>
      )}

      <View style={styles.row}>
        <View style={[styles.iconCircle, { backgroundColor: config.circleColor }]}>
          <Ionicons name={config.icon} size={20} color="#FFFFFF" />
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
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.md,
    gap: spacing.sm,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.textMuted,
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
    color: colors.textMuted,
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
    color: colors.text,
    fontSize: typography.body,
    fontWeight: typography.weightSemi,
  },
});
