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

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const WEEK_BARS = [40, 25, 55, 70, 35, 20, 60];

const TRACKS = [
  { num: '01', title: 'Vocal Presence', progress: 0.72 },
  { num: '02', title: 'Story Structure', progress: 0.45 },
  { num: '03', title: 'Impromptu Flow', progress: 0.18 },
];

export function HomeScreen() {
  const { progress, loading } = useProgress();
  const { fadeIn } = useEntryAnimation(5);
  const gam = useGamification();

  const completedCount = progress?.completedDays.length ?? 0;
  const rank = Math.max(1, 30 - Math.round(completedCount / 2));
  const streakDays = Math.min(completedCount, 99);

  const now = new Date();
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dayLabel = dayNames[now.getDay()];
  const monthNum = String(now.getMonth() + 1).padStart(2, '0');
  const dayNum = String(now.getDate()).padStart(2, '0');
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';
  const todayIndex = (now.getDay() + 6) % 7; // Mon=0

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
        {/* Header */}
        <Animated.View style={[styles.topBar, fadeIn(0)]}>
          <View>
            <Text style={styles.dateCaption}>{dayLabel} / {monthNum}.{dayNum}</Text>
            <Text style={styles.greeting}>{greeting}, User.</Text>
          </View>
          <View style={styles.topRight}>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>{streakDays} DAY STREAK</Text>
            </View>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarLetter}>U</Text>
            </View>
          </View>
        </Animated.View>

        {/* Today's Drill hero card */}
        <Animated.View style={[styles.heroCard, fadeIn(1)]}>
          <Text style={styles.heroCaption}>TODAY'S DRILL</Text>
          <Text style={styles.heroTitle}>Day {progress.currentDayUnlocked ?? 1}</Text>
          <Text style={styles.heroSub}>Vocal clarity and pacing drill. 8 min.</Text>
          <View style={styles.heroMeta}>
            <PointsBadge gems={gam.gems} coins={gam.coins} />
          </View>
          <View style={styles.heroAccentBar} />
        </Animated.View>

        {/* Week bar chart */}
        <Animated.View style={[styles.weekSection, fadeIn(2)]}>
          <Text style={styles.sectionCaption}>THIS WEEK</Text>
          <View style={styles.weekRow}>
            {WEEK_DAYS.map((day, i) => (
              <View key={i} style={styles.weekCol}>
                <View style={styles.weekBarBg}>
                  <View
                    style={[
                      styles.weekBarFill,
                      { height: WEEK_BARS[i] },
                      i === todayIndex && styles.weekBarActive,
                    ]}
                  />
                </View>
                <Text style={[styles.weekLabel, i === todayIndex && styles.weekLabelActive]}>
                  {day}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Your Tracks */}
        <Animated.View style={[styles.tracksSection, fadeIn(3)]}>
          <Text style={styles.sectionCaption}>YOUR TRACKS</Text>
          {TRACKS.map((track) => (
            <View key={track.num} style={styles.trackCard}>
              <Text style={styles.trackNum}>{track.num}</Text>
              <View style={styles.trackBody}>
                <Text style={styles.trackTitle}>{track.title}</Text>
                <View style={styles.trackBarBg}>
                  <View style={[styles.trackBarFill, { width: `${Math.round(track.progress * 100)}%` }]} />
                </View>
              </View>
              <Text style={styles.trackPct}>{Math.round(track.progress * 100)}%</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl },
  topBar: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  dateCaption: {
    fontSize: typography.caption,
    fontFamily: typography.fontFamily.regular,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  greeting: {
    fontSize: typography.heading,
    fontFamily: typography.fontFamily.display,
    color: colors.text,
  },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  streakBadge: {
    borderWidth: 1,
    borderColor: colors.borderAccent,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  streakText: {
    fontSize: typography.caption,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.primary,
    letterSpacing: 1.5,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  avatarLetter: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
  },

  // Hero card
  heroCard: {
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderAccent,
    padding: spacing.lg,
    gap: 8,
    overflow: 'hidden',
    shadowColor: colors.accentGlow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  heroCaption: {
    fontSize: typography.caption,
    fontFamily: typography.fontFamily.regular,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontSize: typography.title,
    fontFamily: typography.fontFamily.display,
    color: colors.text,
  },
  heroSub: {
    fontSize: typography.body,
    fontFamily: typography.fontFamily.regular,
    color: colors.textMuted,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  heroAccentBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.primary,
  },

  // Week bar chart
  weekSection: { gap: spacing.sm },
  sectionCaption: {
    fontSize: typography.caption,
    fontFamily: typography.fontFamily.regular,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 6 },
  weekCol: { flex: 1, alignItems: 'center', gap: 6 },
  weekBarBg: {
    width: '100%',
    height: 70,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  weekBarFill: {
    width: '100%',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 4,
  },
  weekBarActive: {
    backgroundColor: colors.primary,
  },
  weekLabel: {
    fontSize: typography.tiny,
    fontFamily: typography.fontFamily.regular,
    color: colors.textLight,
  },
  weekLabelActive: {
    color: colors.primary,
  },

  // Tracks
  tracksSection: { gap: spacing.sm },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trackNum: {
    fontSize: typography.heading,
    fontFamily: typography.fontFamily.display,
    color: colors.textLight,
  },
  trackBody: { flex: 1, gap: 6 },
  trackTitle: {
    fontSize: typography.body,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text,
  },
  trackBarBg: {
    height: 4,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 2,
    overflow: 'hidden',
  },
  trackBarFill: {
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  trackPct: {
    fontSize: typography.caption,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textMuted,
  },
});
