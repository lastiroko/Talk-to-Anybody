import { useMemo, useRef } from 'react';
import { Animated, FlatList, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { ProgressBar } from '../components/ProgressBar';
import { XPBar } from '../components/XPBar';
import { PointsBadge } from '../components/PointsBadge';
import { SkillBar } from '../components/SkillBar';
import { DotChart } from '../components/DotChart';
import { MetricCard } from '../components/MetricCard';
import { AchievementBadge } from '../components/AchievementBadge';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { ScrollHeader } from '../components/ScrollHeader';
import { EmptyState } from '../components/EmptyState';
import { SkeletonCard, SkeletonCircle, SkeletonLine } from '../components/Skeleton';
import { useEntryAnimation } from '../hooks/useEntryAnimation';
import { useGamification } from '../hooks/useGamification';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';
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

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function ProgressScreen() {
  const { progress, loading } = useProgress();
  const completedDays = progress?.completedDays ?? [];
  const completedCount = completedDays.length;
  const streak = progress?.currentStreak ?? 0;
  const scrollY = useRef(new Animated.Value(0)).current;
  const { fadeIn } = useEntryAnimation(5);
  const gam = useGamification();

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

  // Weekly streak calendar
  const streakDays = useMemo(() => {
    const today = new Date().getDay(); // 0=Sun
    return WEEKDAYS.map((day, i) => {
      const dayIdx = (i + 1) % 7; // Mon=1..Sun=0
      return { label: day, active: dayIdx <= today && i < streak };
    });
  }, [streak]);

  if (loading || !progress) {
    return (
      <ScreenContainer>
        <View style={{ gap: spacing.lg, padding: spacing.lg }}>
          <SkeletonLine width={180} />
          <SkeletonCard />
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <SkeletonCircle size={130} />
          </View>
          <SkeletonCard />
        </View>
      </ScreenContainer>
    );
  }

  if (completedCount === 0) {
    return (
      <ScreenContainer>
        <EmptyState
          icon={'\ud83c\udf99\ufe0f'}
          title="Start your journey"
          subtitle="Complete Day 1 to see your progress here"
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false} scroll={false}>
      <ScrollHeader title="Your Progress" scrollY={scrollY} />
      <Animated.ScrollView
        contentContainerStyle={styles.content}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        {/* Level card with XP + gems + coins */}
        <Animated.View style={[styles.levelCard, shadows.card, fadeIn(0)]}>
          <XPBar current={gam.xpInLevel} target={gam.xpToNextLevel} level={gam.level} />
          <View style={styles.levelBadges}>
            <PointsBadge gems={gam.gems} coins={gam.coins} />
          </View>
        </Animated.View>

        {/* Speaking Score */}
        <Animated.View style={[styles.scoreCard, shadows.card, fadeIn(1)]}>
          <View style={styles.scoreCircle}>
            <AnimatedNumber value={speakingScore} style={styles.scoreNumber} />
          </View>
          <Text style={styles.scoreLabel}>Speaking Score</Text>
          <Text style={styles.scoreSub}>Based on your latest session</Text>
          {scoreChange > 0 ? (
            <Text style={styles.scoreChange}>{'\u2191'} +{scoreChange} from baseline</Text>
          ) : null}
        </Animated.View>

        {/* Skills card */}
        <Animated.View style={[styles.section, fadeIn(2)]}>
          <Text style={styles.sectionTitle}>Skills Radar</Text>
          <View style={[styles.card, shadows.card]}>
            <View style={styles.skillBars}>
              {skillScores.map((s) => (
                <SkillBar key={s.label} label={s.label} value={s.value} />
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Score Over Time */}
        {chartData.length > 1 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Score Over Time</Text>
            <View style={[styles.card, shadows.card]}>
              <DotChart data={chartData} maxValue={100} height={120} />
            </View>
          </View>
        ) : null}

        {/* Achievements */}
        <Animated.View style={[styles.section, fadeIn(3)]}>
          <Text style={styles.sectionTitle}>Achievements</Text>
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
        </Animated.View>

        {/* Weekly streak calendar */}
        <Animated.View style={[styles.section, fadeIn(4)]}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={[styles.weekCard, shadows.card]}>
            <View style={styles.weekRow}>
              {streakDays.map((d, i) => (
                <View key={i} style={styles.weekDay}>
                  <View style={[styles.weekCircle, d.active && styles.weekCircleActive]}>
                    {d.active ? <Text style={styles.weekCheck}>{'\u2713'}</Text> : null}
                  </View>
                  <Text style={styles.weekLabel}>{d.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Key metrics */}
        <View style={styles.section}>
          <View style={styles.metricsGrid}>
            <View style={styles.metricsRow}>
              <MetricCard label="WPM" value={String(wpm)} trend={completedCount > 3 ? 'up' : 'stable'} trendLabel="improving" />
              <MetricCard label="Fillers/min" value={String(fillersPerMin)} trend={completedCount > 3 ? 'down' : 'stable'} trendLabel={completedCount > 3 ? 'decreasing' : ''} />
            </View>
            <View style={styles.metricsRow}>
              <MetricCard label="Avg Pause" value={`${avgPause}s`} trend={completedCount > 3 ? 'up' : 'stable'} trendLabel="longer" />
              <MetricCard label="Vocal Range" value={vocalRange} trend={vocalRange === 'Wide' ? 'up' : 'stable'} trendLabel={vocalRange === 'Narrow' ? '' : 'expanding'} />
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },

  // Level card
  levelCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
    gap: spacing.md,
  },
  levelBadges: {
    alignItems: 'flex-start',
  },

  // Score card
  scoreCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 48,
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
    color: colors.textMuted,
  },
  scoreChange: {
    fontSize: typography.small,
    fontWeight: typography.weightBold,
    color: '#16a34a',
    marginTop: 4,
  },

  // Sections
  section: { gap: spacing.md },
  sectionTitle: {
    fontSize: typography.subheading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
    gap: spacing.md,
  },
  skillBars: { gap: spacing.sm },

  // Weekly streak
  weekCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekDay: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  weekCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekCircleActive: {
    backgroundColor: colors.teal,
  },
  weekCheck: {
    color: '#fff',
    fontSize: 16,
    fontWeight: typography.weightBold,
  },
  weekLabel: {
    fontSize: typography.tiny,
    fontWeight: typography.weightSemi,
    color: colors.textMuted,
  },

  // Metrics grid
  metricsGrid: { gap: spacing.sm },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  bottomSpacer: { height: spacing.xl },
});
