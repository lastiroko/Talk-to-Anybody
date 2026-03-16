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

const CATEGORIES = [
  { label: 'Ethics', icon: '🛡️', tint: '#FCE8D6' },
  { label: 'Technology', icon: '⚙️', tint: '#E6EDFF' },
  { label: 'History', icon: '🌍', tint: '#E9F6DE' },
];

const WAVE = [8, 14, 7, 20, 12, 10, 16, 11, 19, 8, 13, 9, 16, 12, 8, 14, 18, 10, 12, 15, 7, 13, 18, 11, 9, 13];

export function HomeScreen() {
  const { progress, loading } = useProgress();
  const { fadeIn } = useEntryAnimation(5);
  const gam = useGamification();

  const completedCount = progress?.completedDays.length ?? 0;
  const rank = Math.max(1, 30 - Math.round(completedCount / 2));

  if (loading || !progress) {
    return (
      <ScreenContainer>
        <View style={styles.topBar}>
          <SkeletonLine width={40} />
          <SkeletonLine width={130} />
        </View>
        <SkeletonCard />
        <SkeletonCard />
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

        <Animated.View style={[styles.hero, fadeIn(1)]}>
          <Text style={styles.bot}>🤖</Text>
          <View style={styles.rankWrap}>
            <Text style={styles.rank}>{rank}</Text>
            <Text style={styles.rankSuffix}>rd</Text>
          </View>
          <Text style={styles.insight}>Listen every <Text style={styles.insightTag}>Day Insight</Text></Text>
          <Text style={styles.sub}>about your education</Text>
        </Animated.View>

        <Animated.View style={[styles.voiceCard, fadeIn(2)]}>
          <View style={styles.waveRow}>
            {WAVE.map((h, i) => <View key={i} style={[styles.waveBar, { height: h }]} />)}
          </View>
          <View style={styles.mic}><Text style={styles.micTxt}>🎙️</Text></View>
        </Animated.View>

        <Animated.View style={[styles.sectionHeader, fadeIn(3)]}>
          <Text style={styles.sectionTitle}>Select Category <Text style={styles.badge}>34</Text></Text>
          <Text style={styles.link}>View all</Text>
        </Animated.View>

        <Animated.View style={[styles.categoryRow, fadeIn(4)]}>
          {CATEGORIES.map((cat) => (
            <View key={cat.label} style={[styles.catCard, { backgroundColor: cat.tint }]}>
              <Text style={styles.catIcon}>{cat.icon}</Text>
              <Text style={styles.catLabel}>{cat.label}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View style={[styles.featureCard, shadows.card, fadeIn(4)]}>
          <View style={styles.rewardRow}><Text style={styles.reward}>💎 +5</Text><Text style={styles.reward}>🪙 +145</Text><Text style={styles.fire}>🔥</Text></View>
          <View style={styles.featureBody}>
            <Text style={styles.featureBot}>🦾</Text>
            <View style={styles.featureTextWrap}>
              <Text style={styles.featureTag}>Mind Unlocked</Text>
              <Text style={styles.featureTitle}>The Human Mind</Text>
              <Text style={styles.featureSub}>A Deep Dive into Thoughts, Emotions, and Behavior</Text>
            </View>
          </View>
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
  hero: { alignItems: 'center', gap: 2 },
  bot: { fontSize: 70 },
  rankWrap: { flexDirection: 'row', alignItems: 'flex-end' },
  rank: { fontSize: 54, color: '#2F7A98', fontWeight: typography.weightBold },
  rankSuffix: { fontSize: typography.subheading, color: '#2F7A98', fontWeight: typography.weightBold, marginBottom: 8 },
  insight: { fontSize: typography.body, fontWeight: typography.weightSemi, color: colors.text },
  insightTag: { backgroundColor: '#BFDEEC', color: '#1f5f7a' },
  sub: { fontSize: typography.small, color: colors.textBody },
  voiceCard: { backgroundColor: '#CEE5EF', borderRadius: 22, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  waveRow: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  waveBar: { width: 2, borderRadius: 2, backgroundColor: '#3B7892' },
  mic: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#5F93A8', alignItems: 'center', justifyContent: 'center' },
  micTxt: { fontSize: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  sectionTitle: { fontSize: typography.subheading, fontWeight: typography.weightBold, color: colors.text },
  badge: { color: '#2F7A98' },
  link: { color: '#2F7A98', fontWeight: typography.weightSemi },
  categoryRow: { flexDirection: 'row', gap: spacing.sm },
  catCard: { flex: 1, borderRadius: 16, paddingVertical: spacing.md, alignItems: 'center', gap: 6 },
  catIcon: { fontSize: 24 },
  catLabel: { fontSize: typography.tiny, color: colors.textBody, fontWeight: typography.weightSemi },
  featureCard: { backgroundColor: '#FFF6C9', borderRadius: 22, padding: spacing.md, gap: spacing.sm },
  rewardRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  reward: { fontWeight: typography.weightBold, color: '#2f6d86', fontSize: typography.caption },
  fire: { marginLeft: 'auto' },
  featureBody: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  featureBot: { fontSize: 64 },
  featureTextWrap: { flex: 1 },
  featureTag: { color: '#B86B17', fontWeight: typography.weightSemi, fontSize: typography.caption },
  featureTitle: { fontSize: 33/1.5, fontWeight: typography.weightBold, color: colors.text },
  featureSub: { fontSize: typography.small, color: colors.textBody, marginTop: 4 },
});
