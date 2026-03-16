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
          <Text style={styles.avatar}>🤓</Text>
          <PointsBadge gems={gam.gems} coins={gam.coins} />
        </Animated.View>

        <Animated.View style={[styles.titleRow, fadeIn(1)]}>
          <View>
            <Text style={styles.title}>Complete</Text>
            <Text style={styles.title}>Today’s Revenue</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.percent}>{percent}%</Text>
            <Text style={styles.delta}>⦿ {revenue.toFixed(1)}%</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.chartCard, shadows.card, fadeIn(2)]}>
          <View style={styles.chartHead}><Text style={styles.chartTitle}>Study Success</Text><Text style={styles.learn}>Learn more</Text></View>
          <View style={styles.bars}>{BARS.map((h, i) => <View key={i} style={[styles.bar, { height: h }]} />)}</View>
          <View style={styles.months}><Text style={styles.month}>Sep</Text><Text style={styles.month}>Oct</Text><Text style={styles.month}>Now</Text><Text style={styles.month}>Dec</Text><Text style={styles.month}>Jan</Text><Text style={styles.month}>Feb</Text></View>
        </Animated.View>

        <Animated.View style={[styles.challengeHeader, fadeIn(3)]}><Text style={styles.challengeTitle}>Challenges <Text style={styles.challengeCount}>12</Text></Text><Text style={styles.link}>View all</Text></Animated.View>

        <Animated.View style={[styles.challengeCard, { backgroundColor: '#FBEFBE' }, fadeIn(3)]}>
          <Text style={styles.challengeIcon}>🏆</Text><View style={styles.challengeText}><Text style={styles.challengeMain}>Day 10/32 💎 +5   🪙 +200</Text><Text style={styles.challengeSub}>Daily challenge</Text></View><Text style={styles.more}>•••</Text>
        </Animated.View>
        <Animated.View style={[styles.challengeCard, { backgroundColor: '#DDF2D7' }, fadeIn(3)]}>
          <Text style={styles.challengeIcon}>🧪</Text><View style={styles.challengeText}><Text style={styles.challengeMain}>Mastery Marathon 💎 +300</Text><Text style={styles.challengeSub}>Extra challenge</Text></View><Text style={styles.more}>•••</Text>
        </Animated.View>
        <Animated.View style={[styles.challengeCard, { backgroundColor: '#E1E6FA' }, fadeIn(3)]}>
          <Text style={styles.challengeIcon}>🎯</Text><View style={styles.challengeText}><Text style={styles.challengeMain}>Deep Focus 💎 +250</Text><Text style={styles.challengeSub}>Extra challenge</Text></View><Text style={styles.more}>•••</Text>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avatar: { fontSize: 44 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  title: { fontSize: 38/1.5, fontWeight: typography.weightBold, color: colors.text },
  percent: { fontSize: 44/1.5, fontWeight: typography.weightBold, color: '#111827' },
  delta: { color: '#1f7ea4', fontWeight: typography.weightSemi },
  chartCard: { backgroundColor: '#D6ECF7', borderRadius: 24, padding: spacing.md, gap: spacing.md },
  chartHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chartTitle: { fontWeight: typography.weightBold, fontSize: typography.subheading, color: colors.text },
  learn: { color: '#1F7598', borderWidth: 1, borderColor: '#5AA9C8', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, fontSize: typography.tiny },
  bars: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 70 },
  bar: { width: 5, borderRadius: 3, backgroundColor: '#2E7290' },
  months: { flexDirection: 'row', justifyContent: 'space-between' },
  month: { fontSize: typography.tiny, color: colors.textBody },
  challengeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  challengeTitle: { fontSize: typography.subheading, fontWeight: typography.weightBold, color: colors.text },
  challengeCount: { color: '#2F7A98' },
  link: { color: '#2F7A98', fontWeight: typography.weightSemi },
  challengeCard: { borderRadius: 20, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  challengeIcon: { fontSize: 30 },
  challengeText: { flex: 1, gap: 2 },
  challengeMain: { fontWeight: typography.weightBold, color: colors.text },
  challengeSub: { fontSize: typography.small, color: colors.textBody },
  more: { fontSize: 18, color: colors.textMuted },
});
