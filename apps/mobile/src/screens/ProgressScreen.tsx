import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '../components/ScreenContainer';
import { PointsBadge } from '../components/PointsBadge';
import { SkeletonCard, SkeletonLine } from '../components/Skeleton';
import { useEntryAnimation } from '../hooks/useEntryAnimation';
import { useGamification } from '../hooks/useGamification';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { useProgress } from '../hooks/useProgress';

const FILTERS = ['WEEK', 'MONTH', 'ALL'] as const;

export function ProgressScreen() {
  const { progress, loading } = useProgress();
  const { fadeIn } = useEntryAnimation(3);
  const gam = useGamification();
  const completed = progress?.completedDays.length ?? 0;
  const [activeFilter, setActiveFilter] = useState<typeof FILTERS[number]>('WEEK');

  const yourRank = Math.max(8, 30 - completed);

  const leaders = [
    { rank: 1, name: 'Alex Mercer', score: '24,810', delta: 3, up: true },
    { rank: 2, name: 'Jordan Lee', score: '21,445', delta: 1, up: true },
    { rank: 3, name: 'Sam Okoro', score: '19,992', delta: -2, up: false },
    { rank: 4, name: 'Brody Bennet', score: '19,231', delta: 1, up: true },
    { rank: 5, name: 'Mika Tanaka', score: '15,322', delta: -1, up: false },
    { rank: 6, name: 'Dana Voss', score: '15,101', delta: 2, up: true },
    { rank: 7, name: 'Riley Chen', score: '13,899', delta: -3, up: false },
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
        {/* Radial glow bg overlay */}
        <View style={styles.glowOverlay} />

        {/* Top bar */}
        <Animated.View style={[styles.topBar, fadeIn(0)]}>
          <View>
            <Text style={styles.arenaCaption}>ARENA</Text>
            <Text style={styles.title}>This week.</Text>
          </View>
          <PointsBadge gems={gam.gems} coins={gam.coins} />
        </Animated.View>

        {/* Filter pills */}
        <Animated.View style={[styles.filterRow, fadeIn(0)]}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterPill, activeFilter === f && styles.filterPillActive]}
              onPress={() => setActiveFilter(f)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Podium */}
        <Animated.View style={[styles.podiumSection, fadeIn(1)]}>
          <View style={styles.podiumRow}>
            {/* #2 */}
            <View style={styles.podiumCol}>
              <View style={styles.podiumAvatar}>
                <Text style={styles.podiumAvatarText}>J</Text>
              </View>
              <View style={[styles.podiumBar, styles.second]}>
                <Text style={styles.podiumRank}>#2</Text>
              </View>
            </View>
            {/* #1 */}
            <View style={styles.podiumCol}>
              <View style={[styles.podiumAvatar, styles.firstAvatar]}>
                <Text style={styles.podiumAvatarText}>A</Text>
              </View>
              <View style={[styles.podiumBar, styles.first]}>
                <Text style={styles.podiumRank}>#1</Text>
              </View>
            </View>
            {/* #3 */}
            <View style={styles.podiumCol}>
              <View style={styles.podiumAvatar}>
                <Text style={styles.podiumAvatarText}>S</Text>
              </View>
              <View style={[styles.podiumBar, styles.third]}>
                <Text style={styles.podiumRank}>#3</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Leaderboard list */}
        <Animated.View style={[styles.list, fadeIn(2)]}>
          {leaders.map((item) => {
            const isYou = item.rank === yourRank;
            return (
              <View key={item.rank} style={[styles.row, isYou && styles.rowYou]}>
                <Text style={styles.rankNum}>#{item.rank}</Text>
                <View style={[styles.rowAvatar, isYou && styles.rowAvatarYou]}>
                  <Text style={styles.rowAvatarText}>{item.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{item.name}</Text>
                    {isYou && <Text style={styles.youTag}>YOU</Text>}
                  </View>
                  <Text style={styles.score}>{item.score}</Text>
                </View>
                <Text style={[styles.delta, { color: item.up ? '#4ADE80' : '#E63946' }]}>
                  {item.up ? '\u25B2' : '\u25BC'} {Math.abs(item.delta)}
                </Text>
              </View>
            );
          })}
        </Animated.View>

        <View style={styles.yourPlace}>
          <Text style={styles.yourPlaceText}>YOUR PLACE: #{yourRank}</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl },

  glowOverlay: {
    position: 'absolute',
    top: -80,
    left: '20%',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: colors.accentGlow,
    opacity: 0.25,
  },

  topBar: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  arenaCaption: {
    fontSize: typography.caption,
    fontFamily: typography.fontFamily.regular,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  title: {
    fontSize: typography.heading,
    fontFamily: typography.fontFamily.display,
    color: colors.text,
  },

  // Filters
  filterRow: { flexDirection: 'row', gap: 8, marginTop: spacing.xs },
  filterPill: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterPillActive: {
    borderColor: colors.borderHi,
  },
  filterText: {
    fontSize: typography.caption,
    fontFamily: typography.fontFamily.regular,
    color: colors.textLight,
    letterSpacing: 1,
  },
  filterTextActive: {
    color: colors.text,
  },

  // Podium
  podiumSection: { alignItems: 'center', marginTop: spacing.sm },
  podiumRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 4 },
  podiumCol: { alignItems: 'center', gap: 6 },
  podiumAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstAvatar: {
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.accentGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  podiumAvatarText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
  },
  podiumBar: {
    width: 84,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  first: {
    height: 100,
    borderWidth: 1,
    borderColor: colors.borderAccent,
    borderBottomWidth: 0,
  },
  second: { height: 78 },
  third: { height: 60 },
  podiumRank: {
    fontSize: typography.heading,
    fontFamily: typography.fontFamily.display,
    color: colors.text,
  },

  // List
  list: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xs,
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
  },
  rowYou: {
    backgroundColor: colors.surfaceHighlight,
    borderWidth: 1,
    borderColor: colors.borderAccent,
  },
  rankNum: {
    width: 30,
    fontSize: typography.body,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textMuted,
  },
  rowAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowAvatarYou: {
    backgroundColor: colors.primary,
  },
  rowAvatarText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: {
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text,
    fontSize: typography.body,
  },
  youTag: {
    fontSize: typography.tiny,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary,
    letterSpacing: 1,
  },
  score: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontFamily: typography.fontFamily.regular,
    marginTop: 1,
  },
  delta: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.body,
  },

  yourPlace: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  yourPlaceText: {
    fontSize: typography.caption,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.primary,
    letterSpacing: 1.5,
  },
});
