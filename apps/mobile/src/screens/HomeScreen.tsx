import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { PointsBadge } from '../components/PointsBadge';
import { StreakBadge } from '../components/StreakBadge';
import { SkeletonCard, SkeletonLine } from '../components/Skeleton';
import { useEntryAnimation } from '../hooks/useEntryAnimation';
import { useGamification } from '../hooks/useGamification';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';
import { useProgress } from '../hooks/useProgress';
import { MainStackParamList } from '../navigation/types';

type HomeNavigation = NativeStackNavigationProp<MainStackParamList>;

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const TRACKS: Array<{
  num: string;
  title: string;
  startDay: number;
  endDay: number;
  dest: keyof MainStackParamList;
  accent: string;
}> = [
  { num: '01', title: 'Vocal Presence', startDay: 1, endDay: 20, dest: 'Freestyle', accent: colors.primary },
  { num: '02', title: 'Story Structure', startDay: 21, endDay: 40, dest: 'ScriptMode', accent: colors.lavender },
  { num: '03', title: 'Impromptu Flow', startDay: 41, endDay: 60, dest: 'Impromptu', accent: colors.butter },
];

export function HomeScreen() {
  const navigation = useNavigation<HomeNavigation>();
  const { progress, loading } = useProgress();
  const { fadeIn } = useEntryAnimation(5);
  const gam = useGamification();

  const completedDays = progress?.completedDays ?? [];
  const completedCount = completedDays.length;
  const streakDays = Math.min(completedCount, 99);
  const currentDay = progress?.currentDayUnlocked ?? 1;

  const trackProgress = (start: number, end: number) => {
    const span = end - start + 1;
    const done = completedDays.filter((d) => d >= start && d <= end).length;
    return Math.min(1, done / span);
  };

  const handleTrackPress = (dest: keyof MainStackParamList) => {
    navigation.navigate(dest as any);
  };

  const now = new Date();
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
        {/* Soft pastel blob behind everything */}
        <View style={styles.bgBlob} pointerEvents="none" />

        {/* Header */}
        <Animated.View style={[styles.topBar, fadeIn(0)]}>
          <View style={styles.greetingBlock}>
            <Text style={styles.greeting}>{greeting}, Phil ☀️</Text>
            <Text style={styles.greetingSub}>Day {currentDay} of 60 — keep it going.</Text>
          </View>
          <StreakBadge count={streakDays} />
        </Animated.View>

        {/* Today's Drill hero card */}
        <Animated.View style={fadeIn(1)}>
          <Pressable
            style={({ pressed }) => [styles.heroCard, pressed && styles.heroCardPressed]}
            onPress={() => navigation.navigate('DayDetail', { dayNumber: currentDay })}
          >
            <Text style={styles.heroEyebrow}>Today's drill</Text>
            <Text style={styles.heroDay}>Day {currentDay}</Text>
            <Text style={styles.heroSub}>
              Pace control through long-form storytelling — 12 min.
            </Text>
            <View style={styles.heroMeta}>
              <PointsBadge gems={gam.gems} coins={gam.coins} />
              <View style={styles.heroCtaPill}>
                <Text style={styles.heroCtaText}>Start</Text>
                <Ionicons name="chevron-forward" size={14} color={colors.textOnPrimary} />
              </View>
            </View>
          </Pressable>
        </Animated.View>

        {/* This week — 7 circles */}
        <Animated.View style={[styles.weekSection, fadeIn(2)]}>
          <Text style={styles.sectionLabel}>This week</Text>
          <View style={styles.weekRow}>
            {WEEK_DAYS.map((day, i) => {
              const isToday = i === todayIndex;
              const isCompleted = i < todayIndex;
              const isFuture = i > todayIndex;
              return (
                <View key={i} style={styles.weekCol}>
                  <View
                    style={[
                      styles.weekCircle,
                      isCompleted && styles.weekCircleDone,
                      isToday && styles.weekCircleToday,
                      isFuture && styles.weekCircleFuture,
                    ]}
                  >
                    {isCompleted ? (
                      <Ionicons name="checkmark" size={18} color={colors.textOnPrimary} />
                    ) : isToday ? (
                      <View style={styles.weekInnerDot} />
                    ) : null}
                  </View>
                  <Text style={[styles.weekLabel, isToday && styles.weekLabelActive]}>
                    {day}
                  </Text>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Your Tracks */}
        <Animated.View style={[styles.tracksSection, fadeIn(3)]}>
          <Text style={styles.sectionLabel}>Your tracks</Text>
          {TRACKS.map((track) => {
            const pct = trackProgress(track.startDay, track.endDay);
            return (
              <Pressable
                key={track.num}
                style={({ pressed }) => [
                  styles.trackCard,
                  shadows.soft,
                  pressed && styles.trackCardPressed,
                ]}
                onPress={() => handleTrackPress(track.dest)}
              >
                <View style={styles.trackHeader}>
                  <Text style={styles.trackTitle}>{track.title}</Text>
                  <Text style={[styles.trackPct, { color: track.accent }]}>
                    {Math.round(pct * 100)}%
                  </Text>
                </View>
                <Text style={styles.trackSub}>
                  {completedDays.filter(d => d >= track.startDay && d <= track.endDay).length} of{' '}
                  {track.endDay - track.startDay + 1} lessons
                </Text>
                <View style={styles.trackBarBg}>
                  <View
                    style={[
                      styles.trackBarFill,
                      { width: `${Math.round(pct * 100)}%`, backgroundColor: track.accent },
                    ]}
                  />
                </View>
              </Pressable>
            );
          })}
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxxl,
  },

  // Background blob
  bgBlob: {
    position: 'absolute',
    top: -120,
    right: -100,
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: colors.peach,
    opacity: 0.35,
  },

  // Header
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  greetingBlock: {
    flex: 1,
    gap: 2,
  },
  greeting: {
    fontSize: 28,
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.weightSemi,
    color: colors.text,
  },
  greetingSub: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },

  // Hero card — warm peach with Fraunces day number
  heroCard: {
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 28,
    padding: spacing.lg,
    gap: spacing.sm,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 4,
  },
  heroCardPressed: { opacity: 0.92 },
  heroEyebrow: {
    fontSize: 12,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary,
    letterSpacing: 0.3,
  },
  heroDay: {
    fontSize: 48,
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.weightSemi,
    color: colors.text,
    lineHeight: 50,
  },
  heroSub: {
    fontSize: 15,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  heroCtaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  heroCtaText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.bold,
    color: colors.textOnPrimary,
  },

  // Week strip
  weekSection: { gap: spacing.md },
  sectionLabel: {
    fontSize: 13,
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 4,
  },
  weekCol: { flex: 1, alignItems: 'center', gap: 6 },
  weekCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekCircleDone: {
    backgroundColor: colors.mint,
  },
  weekCircleToday: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  weekCircleFuture: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderHi,
  },
  weekInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textOnPrimary,
  },
  weekLabel: {
    fontSize: 11,
    fontFamily: typography.fontFamily.medium,
    color: colors.textMuted,
  },
  weekLabelActive: {
    color: colors.primary,
    fontFamily: typography.fontFamily.bold,
  },

  // Tracks
  tracksSection: { gap: spacing.md },
  trackCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.md,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trackCardPressed: { opacity: 0.92 },
  trackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackTitle: {
    fontSize: 17,
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
  },
  trackSub: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.textMuted,
  },
  trackPct: {
    fontSize: 22,
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.weightSemi,
  },
  trackBarBg: {
    height: 6,
    backgroundColor: colors.track,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 4,
  },
  trackBarFill: {
    height: 6,
    borderRadius: 999,
  },
});
