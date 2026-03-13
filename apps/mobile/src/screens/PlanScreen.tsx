import { useMemo } from 'react';
import { Alert, Animated, FlatList, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { DayTile } from '../components/DayTile';
import { ProgressBar } from '../components/ProgressBar';
import { SkeletonCard, SkeletonLine } from '../components/Skeleton';
import { useEntryAnimation } from '../hooks/useEntryAnimation';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import planData from '../content/plan.v1.json';
import { PlanDay } from '../types/progress';
import { useProgress } from '../hooks/useProgress';
import { usePaywallGate } from '../hooks/usePaywallGate';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';

type PlanNavigation = NativeStackNavigationProp<MainStackParamList>;

const NUM_COLUMNS = 5;

interface GridItem {
  type: 'day' | 'weekLabel';
  dayNumber?: number;
  weekNumber?: number;
  key: string;
}

export function PlanScreen() {
  const { progress, loading } = useProgress();
  const navigation = useNavigation<PlanNavigation>();
  const { isGated } = usePaywallGate();
  const plan = useMemo(() => planData as PlanDay[], []);
  const { fadeIn } = useEntryAnimation(3);

  const completedCount = progress?.completedDays.length ?? 0;
  const progressFraction = completedCount / 60;

  const gridData = useMemo(() => {
    const items: GridItem[] = [];
    let currentWeek = 0;

    plan.forEach((day) => {
      const week = Math.ceil(day.dayNumber / 7);
      if (week !== currentWeek) {
        currentWeek = week;
        items.push({ type: 'weekLabel', weekNumber: week, key: `week-${week}` });
      }
      items.push({ type: 'day', dayNumber: day.dayNumber, key: `day-${day.dayNumber}` });
    });

    return items;
  }, [plan]);

  const getDayStatus = (dayNumber: number): 'completed' | 'current' | 'locked' => {
    if (progress?.completedDays.includes(dayNumber)) return 'completed';
    if (dayNumber === progress?.currentDayUnlocked) return 'current';
    if (progress && dayNumber <= progress.currentDayUnlocked) return 'completed';
    return 'locked';
  };

  const handleDayPress = (dayNumber: number) => {
    const status = getDayStatus(dayNumber);
    if (status === 'locked') {
      Alert.alert(
        'Locked',
        `Complete Day ${progress?.currentDayUnlocked ?? 1} first`,
      );
      return;
    }
    if (isGated({ dayNumber })) {
      navigation.navigate('Paywall');
      return;
    }
    navigation.navigate('DayDetail', { dayNumber });
  };

  if (loading || !progress) {
    return (
      <ScreenContainer>
        <View style={{ gap: spacing.md, padding: spacing.lg }}>
          <SkeletonLine width={200} />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false} scroll={false}>
      {/* Header */}
      <Animated.View style={[styles.header, fadeIn(0)]}>
        <Text style={styles.title}>Your 60-Day Plan</Text>
      </Animated.View>

      <Animated.View style={[styles.progressWrap, fadeIn(1)]}>
        <ProgressBar progress={progressFraction} />
        <Text style={styles.progressLabel}>
          {completedCount} of 60 days completed
        </Text>
      </Animated.View>

      {/* Day grid */}
      <Animated.View style={[{ flex: 1 }, fadeIn(2)]}>
        <FlatList
          data={gridData}
          keyExtractor={(item) => item.key}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={styles.gridContainer}
          renderItem={({ item }) => {
            if (item.type === 'weekLabel') {
              return (
                <View style={styles.weekLabel}>
                  <Text style={styles.weekLabelText}>Week {item.weekNumber}</Text>
                </View>
              );
            }

            const dayNumber = item.dayNumber!;
            const status = getDayStatus(dayNumber);

            return (
              <DayTile
                dayNumber={dayNumber}
                status={status}
                onPress={() => handleDayPress(dayNumber)}
              />
            );
          }}
          getItemLayout={undefined}
        />
      </Animated.View>

      {/* Bottom stats */}
      <View style={styles.bottomBar}>
        <Text style={styles.bottomText}>
          {completedCount} of 60 days completed
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  title: {
    fontSize: typography.heading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  progressWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  progressLabel: {
    fontSize: typography.small,
    color: colors.muted,
    textAlign: 'right',
  },
  gridContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  weekLabel: {
    width: '100%',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    marginTop: spacing.sm,
  },
  weekLabelText: {
    fontSize: typography.small,
    fontWeight: typography.weightSemi,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bottomBar: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  bottomText: {
    fontSize: typography.body,
    fontWeight: typography.weightSemi,
    color: colors.muted,
  },
});
