import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PointsBadge } from '../components/PointsBadge';
import { SkeletonCard, SkeletonLine } from '../components/Skeleton';
import { useEntryAnimation } from '../hooks/useEntryAnimation';
import { useGamification } from '../hooks/useGamification';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { useProgress } from '../hooks/useProgress';

export function ProgressScreen() {
  const { progress, loading } = useProgress();
  const { fadeIn } = useEntryAnimation(3);
  const gam = useGamification();
  const completed = progress?.completedDays.length ?? 0;

  const leaders = [
    { rank: '#4', name: 'Brody Bennet', score: '19,231', delta: '▲', good: true },
    { rank: '#5', name: 'Brody Bennet', score: '15,322', delta: '▼', good: false },
    { rank: '#6', name: 'Brody Bennet', score: '15,101', delta: '▲', good: true },
    { rank: '#7', name: 'Brody Bennet', score: '13,899', delta: '▼', good: false },
  ];

  if (loading || !progress) {
    return (
      <ScreenContainer>
        <View style={{ gap: spacing.md, padding: spacing.lg }}>
          <SkeletonLine width={180} />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false} scroll={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.topBar, fadeIn(0)]}>
          <View style={styles.backBtn}><Text style={styles.backTxt}>‹</Text></View>
          <PointsBadge gems={gam.gems} coins={gam.coins} />
        </Animated.View>

        <Animated.View style={[styles.sunburst, fadeIn(1)]}>
          <Text style={styles.title}>Leaderboard</Text>
          <View style={styles.podiumRow}>
            <View style={[styles.podium, styles.second]}><Text style={styles.podiumTxt}>#2</Text></View>
            <View style={[styles.podium, styles.first]}><Text style={styles.podiumTxt}>#1</Text></View>
            <View style={[styles.podium, styles.third]}><Text style={styles.podiumTxt}>#3</Text></View>
          </View>
          <Text style={styles.centerLabel}>Your place: #{Math.max(8, 30 - completed)}</Text>
        </Animated.View>

        <Animated.View style={[styles.list, fadeIn(2)]}>
          {leaders.map((item) => (
            <View key={item.rank} style={styles.row}>
              <Text style={styles.rank}>{item.rank}</Text>
              <Text style={styles.avatar}>🤖</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.score}>💎 {item.score}</Text>
              </View>
              <Text style={[styles.delta, { color: item.good ? '#65A84B' : '#D75656' }]}>{item.delta}</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#ffffffd9', alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 28, color: colors.textMuted, lineHeight: 30 },
  sunburst: { borderRadius: 28, padding: spacing.lg, backgroundColor: '#F9F7EF' },
  title: { fontSize: 35/1.5, fontWeight: typography.weightBold, color: colors.text, marginBottom: spacing.md },
  podiumRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 4, marginBottom: spacing.sm },
  podium: { width: 84, borderTopLeftRadius: 22, borderTopRightRadius: 22, alignItems: 'center', justifyContent: 'center' },
  first: { height: 100, backgroundColor: '#A9DC85' },
  second: { height: 78, backgroundColor: '#E7B95D' },
  third: { height: 60, backgroundColor: '#EA8B8B' },
  podiumTxt: { fontSize: typography.heading, fontWeight: typography.weightBold, color: '#243046' },
  centerLabel: { textAlign: 'center', color: '#2F7A98', fontWeight: typography.weightSemi },
  list: { backgroundColor: '#fff', borderRadius: 24, padding: spacing.sm, gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 10, paddingHorizontal: spacing.sm },
  rank: { width: 26, fontSize: typography.body, fontWeight: typography.weightBold, color: colors.text },
  avatar: { fontSize: 28 },
  name: { fontWeight: typography.weightSemi, color: colors.text },
  score: { color: '#2F7A98', fontSize: typography.tiny, marginTop: 2 },
  delta: { fontWeight: typography.weightBold },
});
