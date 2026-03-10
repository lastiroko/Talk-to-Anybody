import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { StepIndicator } from '../components/StepIndicator';
import { SelectableCard } from '../components/SelectableCard';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

interface OnboardingGoalScreenProps {
  onNext: () => void;
}

const GOALS = [
  { id: 'public_speaking', emoji: '\ud83c\udfa4', title: 'Public Speaking', subtitle: 'Presentations, talks, speeches' },
  { id: 'interviews', emoji: '\ud83d\udcbc', title: 'Job Interviews', subtitle: 'Nail your next interview' },
  { id: 'meetings', emoji: '\ud83e\udd1d', title: 'Work Meetings', subtitle: 'Speak up with confidence at work' },
  { id: 'social', emoji: '\ud83d\udcac', title: 'Social Confidence', subtitle: 'Feel at ease in conversations' },
];

export function OnboardingGoalScreen({ onNext }: OnboardingGoalScreenProps) {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <StepIndicator currentStep={1} totalSteps={3} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>What's your goal?</Text>
          <Text style={styles.subtitle}>We'll customize your plan around this</Text>
        </View>

        {/* Goal cards */}
        <View style={styles.goals}>
          {GOALS.map((goal) => (
            <SelectableCard
              key={goal.id}
              selected={selectedGoal === goal.id}
              onPress={() => setSelectedGoal(goal.id)}
            >
              <View style={styles.goalContent}>
                <Text style={styles.goalEmoji}>{goal.emoji}</Text>
                <View style={styles.goalText}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalSubtitle}>{goal.subtitle}</Text>
                </View>
              </View>
            </SelectableCard>
          ))}
        </View>

        {/* Continue */}
        <View style={styles.bottom}>
          <PrimaryButton
            title="Continue"
            onPress={onNext}
            disabled={!selectedGoal}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
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
  goals: {
    gap: spacing.md,
    flex: 1,
  },
  goalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  goalEmoji: {
    fontSize: 32,
  },
  goalText: {
    flex: 1,
    gap: 2,
  },
  goalTitle: {
    fontSize: typography.body,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  goalSubtitle: {
    fontSize: typography.small,
    color: colors.muted,
  },
  bottom: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
});
