import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AnimatedNumber } from './AnimatedNumber';
import { Celebration } from './Celebration';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { haptic } from '../utils/haptics';

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
  if (ratio > 0.8) return '#4ADE80';
  if (ratio > 0.5) return '#FACC15';
  return '#E63946';
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

  if (isNewHighScore) {
    haptic.success();
  }

  return (
    <View style={styles.card}>
      <Celebration trigger={isNewHighScore} variant="confetti" />

      {/* Header */}
      <Text style={styles.heading}>
        {isNewHighScore ? 'New High Score!' : 'Great job!'}
      </Text>
      <Text style={styles.subtext}>{encouragement}</Text>

      {/* Score display */}
      <View style={styles.scoreContainer}>
        <AnimatedNumber
          value={score}
          duration={1000}
          suffix={`/${maxScore}`}
          style={[styles.scoreText, { color: scoreColor }]}
        />
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
    backgroundColor: '#141414',
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  heading: {
    fontSize: typography.heading,
    fontWeight: typography.weightBold as '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtext: {
    fontSize: typography.body,
    fontWeight: typography.weightRegular as '400',
    color: '#8A8A8A',
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
    color: '#8A8A8A',
    marginBottom: spacing.lg,
  },
  statsContainer: {
    width: '100%',
    marginBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
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
    color: '#8A8A8A',
  },
  statValue: {
    fontSize: typography.body,
    fontWeight: typography.weightBold as '700',
    color: '#FFFFFF',
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
    borderColor: 'rgba(255,255,255,0.16)',
    paddingVertical: spacing.md,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: typography.body,
    fontWeight: typography.weightSemi as '600',
    color: '#FF4500',
  },
});
