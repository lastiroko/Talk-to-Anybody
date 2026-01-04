import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { Text, StyleSheet, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import planData from '../content/plan.v1.json';
import { PlanDay } from '../types/progress';
import { useProgress } from '../hooks/useProgress';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';

type PlanNavigation = NativeStackNavigationProp<MainStackParamList>;

export function PlanScreen() {
  const { progress, loading } = useProgress();
  const navigation = useNavigation<PlanNavigation>();

  const listData = useMemo(() => planData as PlanDay[], []);

  const handlePress = (dayNumber: number, locked: boolean) => {
    if (locked) return;
    navigation.navigate('DayDetail', { dayNumber });
  };

  const renderItem = ({ item }: { item: PlanDay }) => {
    const locked = progress ? item.dayNumber > progress.currentDayUnlocked : true;
    const completed = progress?.completedDays.includes(item.dayNumber) ?? false;
    return (
      <TouchableOpacity
        style={[styles.card, locked && styles.locked, completed && styles.completed]}
        disabled={locked}
        onPress={() => handlePress(item.dayNumber, locked)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.dayLabel}>Day {item.dayNumber}</Text>
          {completed && <Text style={styles.badge}>Done</Text>}
          {locked && <Text style={styles.badge}>Locked</Text>}
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardBody}>{item.objective}</Text>
        <Text style={styles.meta}>~{item.estimatedMinutes} min</Text>
      </TouchableOpacity>
    );
  };

  if (loading || !progress) {
    return (
      <ScreenContainer>
        <Text style={styles.loading}>Loading plan...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false} scroll={false}>
      <FlatList
        data={listData}
        keyExtractor={(item) => String(item.dayNumber)}
        renderItem={renderItem}
        numColumns={1}
        contentContainerStyle={styles.list}
      />

export function PlanScreen() {
  return (
    <ScreenContainer>
      <View style={styles.section}>
        <Text style={styles.title}>Plan</Text>
        <Text style={styles.subtitle}>60-day plan grid/list placeholder.</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  locked: {
    opacity: 0.6,
  },
  completed: {
    borderColor: colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayLabel: {
    fontSize: typography.subheading,
    fontWeight: typography.weightSemi,
    color: colors.text,
  },
  badge: {
    fontSize: typography.small,
    color: colors.muted,
  },
  cardTitle: {
    fontSize: typography.body,
    fontWeight: typography.weightSemi,
    color: colors.text,
  },
  cardBody: {
    fontSize: typography.body,
    color: colors.muted,
  },
  meta: {
    fontSize: typography.small,
    color: colors.muted,
  },
  loading: {
    marginTop: spacing.lg,
    color: colors.text,
  },
  section: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  title: {
    fontSize: typography.heading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.muted,
  },
});
