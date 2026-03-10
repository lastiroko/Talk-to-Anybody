import { useMemo } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { ProgressBar } from '../components/ProgressBar';
import { SkillBar } from '../components/SkillBar';
import { DotChart } from '../components/DotChart';
import { MetricCard } from '../components/MetricCard';
import { AchievementBadge } from '../components/AchievementBadge';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { useProgress } from '../hooks/useProgress';

const ACHIEVEMENTS = [
  { icon: '\ud83c\udfa4', label: 'First Recording', day: 1 },
  { icon: '\ud83d\udcc5', label: 'Week 1 Complete', day: 7 },
  { icon: '\ud83e\udd2b', label: 'Filler Fighter', day: 22 },
  { icon: '\ud83d\udcf7', label: 'Camera Ready', day: 25 },
  { icon: '\ud83c\udf1f', label: 'Month 1 Done', day: 30 },
  { icon: '\ud83d\udcda', label: 'Storyteller', day: 41 },
  { icon: '\ud83c\udf93', label: 'Graduation', day: 60 },
];

const SKILL_NAMES = ['Pace', 'Pauses', 'Fillers', 'Structure', 'Vocal Variety', 'Clarity', 'Storytelling'];

const COMFORT_LEVELS = [
  'Audio Private',
  'Audio + AI',
  'Camera Private',
  'Camera + AI',
  'Community',
  'Live Group',
];

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export function ProgressScreen() {
  const { progress, loading } = useProgress();
  const completedDays = progress?.completedDays ?? [];
  const completedCount = completedDays.length;
  const streak = progress?.currentStreak ?? 0;

  // Mock data derived from completedDays.length
  const speakingScore = useMemo(
    () => Math.min(100, Math.round(completedCount * 1.5 + 30)),
    [completedCount],
  );
  const scoreChange = speakingScore - 30;

  const skillScores = useMemo(
    () =>
      SKILL_NAMES.map((name, i) => ({
        label: name,
        value: Math.min(100, Math.round(25 + completedCount * 1.2 + seededRandom(i) * 15)),
      })),
    [completedCount],
  );

  const chartData = useMemo(() => {
    const sorted = [...completedDays].sort((a, b) => a - b).slice(-10);
    if (sorted.length === 0) return [];
    return sorted.map((d, i) => ({
      label: `D${d}`,
      value: Math.min(100, Math.round(35 + i * 3.5 + seededRandom(d) * 10)),
    }));
  }, [completedDays]);

  const wpm = useMemo(() => 140 + Math.round(seededRandom(completedCount) * 15), [completedCount]);
  const fillersPerMin = useMemo(
    () => Math.max(0.5, parseFloat((5 - completedCount * 0.15).toFixed(1))),
    [completedCount],
  );
  const avgPause = useMemo(
    () => parseFloat((0.8 + completedCount * 0.02).toFixed(1)),
    [completedCount],
  );
  const vocalRange = completedCount >= 30 ? 'Wide' : completedCount >= 12 ? 'Moderate' : 'Narrow';

  const anxietyPre = useMemo(
    () => parseFloat(Math.max(3, 8 - completedCount * 0.1).toFixed(1)),
    [completedCount],
  );
  const anxietyPost = useMemo(
    () => parseFloat(Math.max(2, 6 - completedCount * 0.12).toFixed(1)),
    [completedCount],
  );

  const comfortLevel = completedCount >= 55 ? 6 : completedCount >= 49 ? 5 : completedCount >= 36 ? 4 : completedCount >= 25 ? 3 : completedCount >= 12 ? 2 : 1;

  if (loading || !progress) {
    return (
      <ScreenContainer>
        <Text style={styles.loadingText}>Loading...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false} scroll={false}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <Text style={styles.title}>Your Progress</Text>

        {/* Streak & Days banner */}
        <View style={styles.streakBanner}>
          <View style={styles.streakLeft}>
            <Text style={styles.streakNumber}>{'\ud83d\udd25'} {streak}</Text>
            <Text style={styles.streakLabel}>day streak</Text>
          </View>
          <View style={styles.dividerVert} />
          <View style={styles.streakRight}>
            <Text style={styles.daysNumber}>{completedCount}/60</Text>
            <Text style={styles.streakLabel}>days</Text>
            <View style={styles.miniProgress}>
              <ProgressBar progress={completedCount / 60} />
            </View>
          </View>
        </View>

        {/* Speaking Score card */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreNumber}>{speakingScore}</Text>
          <Text style={styles.scoreLabel}>Speaking Score</Text>
          <Text style={styles.scoreSub}>Based on your latest session</Text>
          {scoreChange > 0 ? (
            <Text style={styles.scoreChange}>{'\u2191'} +{scoreChange} from baseline</Text>
          ) : null}
        </View>

        {/* Trend charts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'\ud83d\udcc8'} Your Trends</Text>

          {/* Skills Radar */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Skills Radar</Text>
            <View style={styles.skillBars}>
              {skillScores.map((s) => (
                <SkillBar key={s.label} label={s.label} value={s.value} />
              ))}
            </View>
          </View>

          {/* Score Over Time */}
          {chartData.length > 1 ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Score Over Time</Text>
              <DotChart data={chartData} maxValue={100} height={120} />
            </View>
          ) : null}
        </View>

        {/* Key metrics */}
        <View style={styles.section}>
          <View style={styles.metricsGrid}>
            <View style={styles.metricsRow}>
              <MetricCard
                label="WPM"
                value={String(wpm)}
                trend={completedCount > 3 ? 'up' : 'stable'}
                trendLabel="improving"
              />
              <MetricCard
                label="Fillers/min"
                value={String(fillersPerMin)}
                trend={completedCount > 3 ? 'down' : 'stable'}
                trendLabel={completedCount > 3 ? 'decreasing' : ''}
              />
            </View>
            <View style={styles.metricsRow}>
              <MetricCard
                label="Avg Pause"
                value={`${avgPause}s`}
                trend={completedCount > 3 ? 'up' : 'stable'}
                trendLabel="longer"
              />
              <MetricCard
                label="Vocal Range"
                value={vocalRange}
                trend={vocalRange === 'Wide' ? 'up' : 'stable'}
                trendLabel={vocalRange === 'Narrow' ? '' : 'expanding'}
              />
            </View>
          </View>
        </View>

        {/* Anxiety Trend */}
        {completedCount >= 4 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{'\ud83d\ude0c'} Anxiety Trend</Text>
            <View style={styles.card}>
              <View style={styles.anxietyRow}>
                <View style={styles.anxietyItem}>
                  <Text style={styles.anxietyValue}>{anxietyPre}</Text>
                  <Text style={styles.anxietyLabel}>Before sessions</Text>
                </View>
                <View style={styles.anxietyItem}>
                  <Text style={styles.anxietyValue}>{anxietyPost}</Text>
                  <Text style={styles.anxietyLabel}>After sessions</Text>
                </View>
              </View>
              <View style={styles.anxietyBars}>
                <View style={styles.anxietyBarRow}>
                  <Text style={styles.anxietyBarLabel}>Before</Text>
                  <View style={styles.anxietyBarTrack}>
                    <View
                      style={[styles.anxietyBarFill, styles.anxietyBarPre, { width: `${anxietyPre * 10}%` }]}
                    />
                  </View>
                </View>
                <View style={styles.anxietyBarRow}>
                  <Text style={styles.anxietyBarLabel}>After</Text>
                  <View style={styles.anxietyBarTrack}>
                    <View
                      style={[styles.anxietyBarFill, styles.anxietyBarPost, { width: `${anxietyPost * 10}%` }]}
                    />
                  </View>
                </View>
              </View>
              {anxietyPre - anxietyPost > 0.5 ? (
                <Text style={styles.anxietyMilestone}>
                  Your anxiety dropped {(anxietyPre - anxietyPost).toFixed(1)} points! {'\ud83c\udf89'}
                </Text>
              ) : null}
            </View>
          </View>
        ) : null}

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'\ud83c\udfc6'} Achievements</Text>
          <FlatList
            data={ACHIEVEMENTS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.label}
            renderItem={({ item }) => (
              <AchievementBadge
                icon={item.icon}
                label={item.label}
                unlocked={completedDays.includes(item.day)}
              />
            )}
          />
        </View>

        {/* Comfort Level / Desensitization */}
        {completedCount >= 4 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{'\ud83e\udea8'} Comfort Level</Text>
            <View style={styles.card}>
              {COMFORT_LEVELS.slice().reverse().map((level, i) => {
                const stepNum = COMFORT_LEVELS.length - i;
                const reached = stepNum <= comfortLevel;
                return (
                  <View key={level} style={styles.ladderStep}>
                    <View style={[styles.ladderDot, reached ? styles.ladderReached : styles.ladderUnreached]} />
                    <Text style={[styles.ladderLabel, reached && styles.ladderLabelReached]}>
                      {level}
                    </Text>
                    {stepNum === comfortLevel ? (
                      <Text style={styles.ladderCurrent}>{'\u25c0'} You are here</Text>
                    ) : null}
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}

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
  loadingText: {
    fontSize: typography.body,
    color: colors.muted,
    marginTop: spacing.lg,
  },
  title: {
    fontSize: typography.heading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },

  // Streak banner
  streakBanner: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  streakLeft: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  streakRight: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  streakNumber: {
    fontSize: 28,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  daysNumber: {
    fontSize: 22,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  streakLabel: {
    fontSize: typography.small,
    color: colors.muted,
  },
  dividerVert: {
    width: 1,
    height: 50,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  miniProgress: {
    width: '80%',
    marginTop: 4,
  },

  // Score card
  scoreCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  scoreNumber: {
    fontSize: 56,
    fontWeight: typography.weightBold,
    color: colors.primary,
  },
  scoreLabel: {
    fontSize: typography.subheading,
    fontWeight: typography.weightSemi,
    color: colors.text,
  },
  scoreSub: {
    fontSize: typography.small,
    color: colors.muted,
  },
  scoreChange: {
    fontSize: typography.small,
    fontWeight: typography.weightBold,
    color: '#16a34a',
    marginTop: 4,
  },

  // Sections
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.subheading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  cardTitle: {
    fontSize: typography.body,
    fontWeight: typography.weightBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  skillBars: {
    gap: spacing.sm,
  },

  // Metrics grid
  metricsGrid: {
    gap: spacing.sm,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  // Anxiety
  anxietyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  anxietyItem: {
    alignItems: 'center',
    gap: 4,
  },
  anxietyValue: {
    fontSize: 28,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  anxietyLabel: {
    fontSize: typography.small,
    color: colors.muted,
  },
  anxietyBars: {
    gap: spacing.sm,
  },
  anxietyBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  anxietyBarLabel: {
    width: 45,
    fontSize: typography.small,
    color: colors.muted,
  },
  anxietyBarTrack: {
    flex: 1,
    height: 10,
    backgroundColor: colors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  anxietyBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  anxietyBarPre: {
    backgroundColor: '#f97316',
  },
  anxietyBarPost: {
    backgroundColor: '#22c55e',
  },
  anxietyMilestone: {
    fontSize: typography.body,
    fontWeight: typography.weightSemi,
    color: '#16a34a',
    textAlign: 'center',
  },

  // Ladder
  ladderStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 6,
  },
  ladderDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  ladderReached: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  ladderUnreached: {
    backgroundColor: '#fff',
    borderColor: colors.border,
  },
  ladderLabel: {
    fontSize: typography.small,
    color: colors.muted,
    flex: 1,
  },
  ladderLabelReached: {
    color: colors.text,
    fontWeight: typography.weightSemi,
  },
  ladderCurrent: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: typography.weightBold,
  },

  bottomSpacer: {
    height: spacing.xl,
  },
});
