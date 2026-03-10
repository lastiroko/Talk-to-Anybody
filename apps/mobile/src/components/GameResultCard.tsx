import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface GameResultCardProps {
  gameName: string;
  score: number;
  maxScore: number;
  highScore: number;
  isNewHighScore: boolean;
  stats: { label: string; value: string }[];
  onPlayAgain: () => void;
  onExit: () => void;
}

function getScoreColor(score: number, maxScore: number): string {
  const ratio = score / maxScore;
  if (ratio > 0.8) return '#16a34a';
  if (ratio > 0.5) return '#f59e0b';
  return '#ef4444';
}

function getEncouragement(score: number, maxScore: number): string {
  const ratio = score / maxScore;
  if (ratio > 0.8) return 'Amazing performance!';
  if (ratio > 0.5) return 'Solid effort — you are improving!';
  return 'Keep practicing! Every attempt makes you better.';
}

export default function GameResultCard({
  gameName,
  score,
  maxScore,
  highScore,
  isNewHighScore,
  stats,
  onPlayAgain,
  onExit,
}: GameResultCardProps) {
  const scoreColor = getScoreColor(score, maxScore);
  const encouragement = getEncouragement(score, maxScore);

  return (
    <View style={styles.card}>
      {/* Header */}
      <Text style={styles.heading}>
        {isNewHighScore ? 'New High Score!' : 'Great job!'}
      </Text>
      <Text style={styles.subtext}>{encouragement}</Text>

      {/* Score display */}
      <View style={styles.scoreContainer}>
        <Text style={[styles.scoreText, { color: scoreColor }]}>
          {score}/{maxScore}
        </Text>
      </View>

      {/* Previous best */}
      <Text style={styles.previousBest}>Previous best: {highScore}</Text>

      {/* Stats rows */}
      {stats.length > 0 && (
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statRow}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Play Again button */}
      <TouchableOpacity style={styles.primaryButton} onPress={onPlayAgain}>
        <Text style={styles.primaryButtonText}>Play Again</Text>
      </TouchableOpacity>

      {/* Back to Practice button */}
      <TouchableOpacity style={styles.secondaryButton} onPress={onExit}>
        <Text style={styles.secondaryButtonText}>Back to Practice</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
  },
  heading: {
    fontSize: typography.heading,
    fontWeight: typography.weightBold as '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtext: {
    fontSize: typography.body,
    fontWeight: typography.weightRegular as '400',
    color: colors.muted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  scoreContainer: {
    marginBottom: spacing.sm,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: typography.weightBold as '700',
    textAlign: 'center',
  },
  previousBest: {
    fontSize: typography.small,
    fontWeight: typography.weightRegular as '400',
    color: colors.muted,
    marginBottom: spacing.lg,
  },
  statsContainer: {
    width: '100%',
    marginBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  statLabel: {
    fontSize: typography.body,
    fontWeight: typography.weightRegular as '400',
    color: colors.muted,
  },
  statValue: {
    fontSize: typography.body,
    fontWeight: typography.weightBold as '700',
    color: colors.text,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  primaryButtonText: {
    fontSize: typography.body,
    fontWeight: typography.weightSemi as '600',
    color: '#ffffff',
  },
  secondaryButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: typography.body,
    fontWeight: typography.weightSemi as '600',
    color: colors.primary,
  },
});
