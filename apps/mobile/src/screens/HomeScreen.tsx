import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { SkeletonCard, SkeletonLine } from '../components/Skeleton';
import { Avatar } from '../components/Avatar';
import { Blob } from '../components/Blob';
import { Ring } from '../components/Ring';
import {
  CurrencyRow,
  MinutesChart,
  ChallengeRow,
  SectionHeader,
} from '../components/Rich';
import { useGamification } from '../hooks/useGamification';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useProgress } from '../hooks/useProgress';
import { MainStackParamList } from '../navigation/types';

type HomeNavigation = NativeStackNavigationProp<MainStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<HomeNavigation>();
  const { progress, loading } = useProgress();
  const gam = useGamification();

  const completedDays = progress?.completedDays ?? [];
  const currentDay = progress?.currentDayUnlocked ?? 1;

  // Today's goal: 3 drills, count how many are done conceptually.
  // For now: derive a 0–100% from completed exercises that day. Real wire-up
  // would come from useProgress when day-level drill counts exist.
  const drillsDone = Math.min(3, Math.floor((completedDays.length % 7) % 4));
  const goalPct = Math.round((drillsDone / 3) * 100);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';

  if (loading || !progress) {
    return (
      <ScreenContainer>
        <View style={{ gap: 16, padding: 20 }}>
          <SkeletonLine width={40} />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false} scroll={false}>
      <Blob color={colors.surfaceHighlight} size={240} top={-50} right={-90} opacity={0.7} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: avatar + greeting + currency */}
        <View style={styles.headerRow}>
          <View style={styles.greetingBlock}>
            <Avatar size={44} icon="person" from="#FFB07A" to={colors.primary} />
            <View>
              <Text style={styles.greetingLabel}>{greeting}</Text>
              <Text style={styles.greetingName}>Phil</Text>
            </View>
          </View>
          <CurrencyRow gems={gam.gems || 144} coins={gam.coins || 2321} />
        </View>

        {/* Today's goal — big numeral + ring */}
        <Pressable
          style={styles.goalRow}
          onPress={() => navigation.navigate('DayDetail', { dayNumber: currentDay })}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.goalTitle}>Today's goal</Text>
            <View style={styles.goalPctRow}>
              <Text style={styles.goalPctBig}>{goalPct}</Text>
              <Text style={styles.goalPctSign}>%</Text>
            </View>
            <View style={styles.goalSubRow}>
              <Ionicons name="caret-up" size={13} color={colors.mint} />
              <Text style={styles.goalSub}>
                {drillsDone} of 3 drills done
              </Text>
            </View>
          </View>
          <Ring size={92} stroke={9} pct={goalPct} color={colors.primary}>
            <Ionicons name="flame" size={30} color={colors.primary} />
          </Ring>
        </Pressable>

        {/* Speaking minutes chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Speaking minutes</Text>
            <View style={styles.weekPill}>
              <Text style={styles.weekPillText}>This week</Text>
            </View>
          </View>
          <MinutesChart />
          <View style={styles.chartLabels}>
            <Text style={styles.chartLabel}>Mon</Text>
            <Text style={styles.chartLabel}>Wed</Text>
            <Text style={styles.chartLabel}>Fri</Text>
            <Text style={styles.chartLabel}>Sun</Text>
          </View>
        </View>

        {/* Today's drills */}
        <SectionHeader
          title="Today's drills"
          count={3}
          actionText="View all"
          onAction={() => navigation.navigate('Tabs', { screen: 'Plan' } as any)}
        />

        <View style={{ gap: 10 }}>
          <ChallengeRow
            icon="book"
            color="#C2410C"
            bg="#FFCBA8"
            title={`Day ${currentDay} · Storytelling`}
            sub="Daily drill"
            gem={12}
            coin={3}
            onPress={() => navigation.navigate('DayDetail', { dayNumber: currentDay })}
          />
          <ChallengeRow
            icon="shuffle"
            color="#6D28D9"
            bg="#D6C6FF"
            title="Filler Swap"
            sub="Mini-game"
            gem={8}
            coin={2}
            onPress={() => navigation.navigate('FillerSwap' as any)}
          />
          <ChallengeRow
            icon="briefcase"
            color="#1E8A63"
            bg="#B6EBD3"
            title="Role-play: interview"
            sub="Extra drill"
            gem={15}
            coin={5}
            onPress={() => navigation.navigate('Roleplay' as any)}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 24,
  },

  // Header row
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  greetingLabel: {
    fontFamily: typography.fontFamily.semiBold,
    fontWeight: typography.weightSemi,
    fontSize: 12,
    color: colors.textMuted,
  },
  greetingName: {
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.weightBold,
    fontSize: 17,
    color: colors.text,
    lineHeight: 19,
  },

  // Today's goal
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  goalTitle: {
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.weightBold,
    fontSize: 22,
    color: colors.text,
    lineHeight: 24,
  },
  goalPctRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 6,
  },
  goalPctBig: {
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.weightSemi,
    fontSize: 52,
    color: colors.primary,
    lineHeight: 52,
  },
  goalPctSign: {
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.weightSemi,
    fontSize: 26,
    color: colors.primary,
  },
  goalSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  goalSub: {
    fontFamily: typography.fontFamily.semiBold,
    fontWeight: typography.weightSemi,
    fontSize: 13,
    color: '#2EBD7E',
  },

  // Minutes chart card
  chartCard: {
    marginTop: 18,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    shadowColor: '#1F1B16',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chartTitle: {
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.weightBold,
    fontSize: 15,
    color: colors.text,
  },
  weekPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.primaryLight,
  },
  weekPillText: {
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.weightBold,
    fontSize: 12,
    color: colors.primary,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  chartLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 11,
    color: colors.textMuted,
  },
});
