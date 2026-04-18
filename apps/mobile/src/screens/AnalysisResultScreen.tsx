import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { MetricCard } from '../components/MetricCard';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { Celebration } from '../components/Celebration';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';
import { MainStackParamList } from '../navigation/types';
import { getAnalysis } from '../services/api';

function scoreColor(score: number): string {
  if (score > 70) return colors.teal;
  if (score >= 40) return colors.gold;
  return colors.error;
}

function pauseLabel(val: number): string {
  if (val < 0.3) return 'Too short';
  if (val > 1.5) return 'Too long';
  return 'Good';
}

function fillerTrend(val: number): 'up' | 'down' | 'stable' {
  if (val < 1) return 'down';
  if (val > 3) return 'up';
  return 'stable';
}

type AnalysisData = Awaited<ReturnType<typeof getAnalysis>>;

export function AnalysisResultScreen() {
  const route = useRoute<RouteProp<MainStackParamList, 'AnalysisResult'>>();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { sessionId, dayNumber } = route.params;

  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

  useEffect(() => {
    getAnalysis(sessionId).then(setAnalysis);
  }, [sessionId]);

  if (!analysis) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading results...</Text>
        </View>
      </ScreenContainer>
    );
  }

  const overall = analysis.scores.overall;
  const ringColor = scoreColor(overall);
  const showConfetti = overall > 80;
  const showGlow = overall > 60 && overall <= 80;

  return (
    <ScreenContainer padded={false} scroll={false}>
      <Celebration trigger={showConfetti} variant="confetti" />
      <Celebration trigger={showGlow} variant="glow" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* XP earned */}
        <View style={styles.xpBanner}>
          <Text style={styles.xpText}>+50 XP  {'\ud83d\udc8e'}+5  {'\ud83e\ude99'}+100</Text>
        </View>

        {/* Header */}
        <Text style={styles.title}>Your Results</Text>

        {/* Overall score circle */}
        <View style={styles.scoreCircleContainer}>
          <View style={[styles.scoreCircle, { borderColor: ringColor }]}>
            <AnimatedNumber
              value={overall}
              duration={1000}
              style={[styles.scoreNumber, { color: ringColor }]}
            />
          </View>
          <Text style={styles.scoreLabel}>Speaking Score</Text>
        </View>

        {/* Sub-scores row */}
        <View style={styles.subScoresRow}>
          <View style={[styles.subScoreCard, shadows.card]}>
            <Text style={styles.subScoreIcon}>{'\ud83c\udfa4'}</Text>
            <AnimatedNumber
              value={analysis.scores.delivery}
              style={[styles.subScoreValue, { color: scoreColor(analysis.scores.delivery) }]}
            />
            <Text style={styles.subScoreLabel}>Delivery</Text>
          </View>
          <View style={[styles.subScoreCard, shadows.card]}>
            <Text style={styles.subScoreIcon}>{'\ud83d\udc8e'}</Text>
            <AnimatedNumber
              value={analysis.scores.clarity}
              style={[styles.subScoreValue, { color: scoreColor(analysis.scores.clarity) }]}
            />
            <Text style={styles.subScoreLabel}>Clarity</Text>
          </View>
          <View style={[styles.subScoreCard, shadows.card]}>
            <Text style={styles.subScoreIcon}>{'\ud83d\udcd6'}</Text>
            <AnimatedNumber
              value={analysis.scores.story}
              style={[styles.subScoreValue, { color: scoreColor(analysis.scores.story) }]}
            />
            <Text style={styles.subScoreLabel}>Story</Text>
          </View>
        </View>

        {/* Metrics section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'\ud83d\udcca'} Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricsRow}>
              <MetricCard
                label="WPM"
                value={String(analysis.metrics.wpm)}
                trend={analysis.metrics.wpm >= 130 && analysis.metrics.wpm <= 160 ? 'up' : 'stable'}
                trendLabel="Target: 130-160"
              />
              <MetricCard
                label="Fillers/min"
                value={String(analysis.metrics.fillerPerMin)}
                trend={fillerTrend(analysis.metrics.fillerPerMin)}
                trendLabel={analysis.metrics.fillerPerMin < 1 ? 'Great!' : analysis.metrics.fillerPerMin > 3 ? 'Work on it' : 'Okay'}
              />
            </View>
            <View style={styles.metricsRow}>
              <MetricCard
                label="Avg Pause"
                value={`${analysis.metrics.avgPauseSec}s`}
                trend={pauseLabel(analysis.metrics.avgPauseSec) === 'Good' ? 'up' : 'stable'}
                trendLabel={pauseLabel(analysis.metrics.avgPauseSec)}
              />
              <MetricCard
                label="Pitch Range"
                value={`${analysis.metrics.pitchRangeHz} Hz`}
                trend="stable"
                trendLabel=""
              />
            </View>
          </View>
        </View>

        {/* Wins - green left stripe */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'\ud83c\udf1f'} What went well</Text>
          {analysis.wins.map((win, i) => (
            <View key={i} style={[styles.stripeCard, shadows.soft]}>
              <View style={[styles.stripe, { backgroundColor: colors.success }]} />
              <Text style={styles.stripeCardText}>{'\u2705'} {win}</Text>
            </View>
          ))}
        </View>

        {/* Fixes - orange left stripe */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'\ud83c\udfaf'} Focus areas</Text>
          {analysis.fixes.map((fix, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.stripeCard, shadows.soft]}
              onPress={() => Alert.alert('Drill coming soon', `"${fix.title}" drill will be available in a future update.`)}
              activeOpacity={0.7}
            >
              <View style={[styles.stripe, { backgroundColor: colors.categoryOrange }]} />
              <Text style={styles.stripeCardText}>{'\ud83d\udd27'} {fix.title}</Text>
              <Text style={styles.fixArrow}>{'\u203a'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Coaching message - gold tint */}
        <View style={[styles.coachingCard, shadows.card]}>
          <Text style={styles.coachingLabel}>{'\ud83e\uddd1\u200d\ud83c\udfeb'} Coach says:</Text>
          <Text style={styles.coachingText}>{analysis.coachingText}</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <PrimaryButton
            title="Continue"
            onPress={() => {
              if (dayNumber) {
                navigation.navigate('DayDetail', {
                  dayNumber,
                  completedExerciseId: route.params.exerciseId,
                });
              } else {
                navigation.goBack();
              }
            }}
          />
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => Alert.alert('Coming soon', 'Sharing will be available in a future update.')}
          >
            <Text style={styles.shareText}>Share Progress</Text>
          </TouchableOpacity>
        </View>

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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: typography.body,
    color: colors.textMuted,
  },

  // XP banner
  xpBanner: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,69,0,0.12)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,69,0,0.3)',
  },
  xpText: {
    fontSize: typography.body,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.weightBold,
    color: colors.primary,
  },

  title: {
    fontSize: typography.title,
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.weightBold,
    color: colors.text,
  },

  // Score circle
  scoreCircleContainer: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  scoreCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    shadowColor: colors.accentGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: typography.weightBold,
  },
  scoreLabel: {
    fontSize: typography.subheading,
    fontFamily: typography.fontFamily.semiBold,
    fontWeight: typography.weightSemi,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Sub-scores
  subScoresRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  subScoreCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subScoreIcon: { fontSize: 20 },
  subScoreValue: {
    fontSize: 22,
    fontWeight: typography.weightBold,
  },
  subScoreLabel: {
    fontSize: typography.small,
    fontFamily: typography.fontFamily.regular,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Sections
  section: { gap: spacing.sm },
  sectionTitle: {
    fontSize: typography.subheading,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.weightBold,
    color: colors.text,
  },

  // Metrics
  metricsGrid: { gap: spacing.sm },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  // Stripe cards (wins/fixes)
  stripeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  stripe: {
    width: 5,
    alignSelf: 'stretch',
  },
  stripeCardText: {
    flex: 1,
    fontSize: typography.body,
    color: colors.text,
    padding: spacing.md,
  },
  fixArrow: {
    fontSize: 20,
    color: colors.textMuted,
    paddingRight: spacing.md,
  },

  // Coaching
  coachingCard: {
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 18,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,69,0,0.3)',
  },
  coachingLabel: {
    fontSize: typography.caption,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.weightBold,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  coachingText: {
    fontSize: typography.body,
    color: colors.text,
    lineHeight: 24,
  },

  // Actions
  actions: { gap: spacing.md },
  shareButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  shareText: {
    fontSize: typography.body,
    color: colors.primary,
    fontWeight: typography.weightSemi,
  },

  bottomSpacer: { height: spacing.lg },
});
