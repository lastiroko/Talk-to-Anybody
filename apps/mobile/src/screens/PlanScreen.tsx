import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PointsBadge } from '../components/PointsBadge';
import { SkeletonCard, SkeletonLine } from '../components/Skeleton';
import { useEntryAnimation } from '../hooks/useEntryAnimation';
import { useGamification } from '../hooks/useGamification';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';
import { useProgress } from '../hooks/useProgress';

const BARS = [28, 22, 18, 16, 14, 12, 11, 10, 12, 14, 15, 18, 21, 25, 30, 34, 38, 42, 45, 48, 50, 54, 57, 60, 58, 56];

export function PlanScreen() {
  const { progress, loading } = useProgress();
  const { fadeIn } = useEntryAnimation(4);
  const gam = useGamification();

  const completedCount = progress?.completedDays.length ?? 0;
  const percent = Math.min(100, Math.round((completedCount / 60) * 100));
  const revenue = 2.3 + completedCount * 0.05;

  if (loading || !progress) {
    return (
      <ScreenContainer>
        <View style={{ gap: spacing.md, padding: spacing.lg }}>
          <SkeletonLine width={220} />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false} scroll={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.header, fadeIn(0)]}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>U</Text>
          </View>
          <PointsBadge gems={gam.gems} coins={gam.coins} />
        </Animated.View>

        <Animated.View style={[styles.titleRow, fadeIn(1)]}>
          <View>
            <Text style={styles.titleCaption}>COMPLETION</Text>
            <Text style={styles.title}>Today's Revenue</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.percent}>{percent}%</Text>
            <Text style={styles.delta}>{revenue.toFixed(1)}%</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.chartCard, fadeIn(2)]}>
          <View style={styles.chartHead}>
            <Text style={styles.chartTitle}>Study Success</Text>
            <View style={styles.learnPill}>
              <Text style={styles.learnText}>LEARN MORE</Text>
            </View>
          </View>
          <View style={styles.bars}>
            {BARS.map((h, i) => (
              <View key={i} style={[styles.bar, { height: h }]} />
            ))}
          </View>
          <View style={styles.months}>
            <Text style={styles.month}>Sep</Text>
            <Text style={styles.month}>Oct</Text>
            <Text style={styles.month}>Now</Text>
            <Text style={styles.month}>Dec</Text>
            <Text style={styles.month}>Jan</Text>
            <Text style={styles.month}>Feb</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.challengeHeader, fadeIn(3)]}>
          <Text style={styles.challengeCaption}>CHALLENGES</Text>
          <Text style={styles.link}>View all</Text>
        </Animated.View>

        <Animated.View style={[styles.challengeCard, fadeIn(3)]}>
          <Text style={styles.challengeNum}>01</Text>
          <View style={styles.challengeText}>
            <Text style={styles.challengeMain}>Day 10/32  +5  +200</Text>
            <Text style={styles.challengeSub}>Daily challenge</Text>
          </View>
          <Text style={styles.more}>...</Text>
        </Animated.View>
        <Animated.View style={[styles.challengeCard, fadeIn(3)]}>
          <Text style={styles.challengeNum}>02</Text>
          <View style={styles.challengeText}>
            <Text style={styles.challengeMain}>Mastery Marathon  +300</Text>
            <Text style={styles.challengeSub}>Extra challenge</Text>
          </View>
          <Text style={styles.more}>...</Text>
        </Animated.View>
        <Animated.View style={[styles.challengeCard, fadeIn(3)]}>
          <Text style={styles.challengeNum}>03</Text>
          <View style={styles.challengeText}>
            <Text style={styles.challengeMain}>Deep Focus  +250</Text>
            <Text style={styles.challengeSub}>Extra challenge</Text>
          </View>
          <Text style={styles.more}>...</Text>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  titleCaption: {
    fontSize: typography.caption,
    fontFamily: typography.fontFamily.regular,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  title: {
    fontSize: typography.heading,
    fontFamily: typography.fontFamily.display,
    color: colors.text,
  },
  percent: {
    fontSize: 28,
    fontFamily: typography.fontFamily.display,
    color: colors.text,
  },
  delta: {
    fontSize: typography.body,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.primary,
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  chartHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chartTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.subheading,
    color: colors.text,
  },
  learnPill: {
    borderWidth: 1,
    borderColor: colors.borderHi,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  learnText: {
    fontSize: typography.tiny,
    fontFamily: typography.fontFamily.regular,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  bars: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 70 },
  bar: {
    width: 5,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  months: { flexDirection: 'row', justifyContent: 'space-between' },
  month: {
    fontSize: typography.tiny,
    fontFamily: typography.fontFamily.regular,
    color: colors.textMuted,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  challengeCaption: {
    fontSize: typography.caption,
    fontFamily: typography.fontFamily.regular,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  link: {
    color: colors.primary,
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.caption,
    letterSpacing: 1,
  },
  challengeCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  challengeNum: {
    fontSize: typography.heading,
    fontFamily: typography.fontFamily.display,
    color: colors.textLight,
    width: 32,
  },
  challengeText: { flex: 1, gap: 2 },
  challengeMain: {
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text,
    fontSize: typography.body,
  },
  challengeSub: {
    fontSize: typography.small,
    fontFamily: typography.fontFamily.regular,
    color: colors.textMuted,
  },
  more: {
    fontSize: 18,
    color: colors.textLight,
    fontFamily: typography.fontFamily.regular,
  },
});
