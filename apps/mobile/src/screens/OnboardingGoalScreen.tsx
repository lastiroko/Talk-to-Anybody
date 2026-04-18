import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { StepIndicator } from '../components/StepIndicator';
import { SelectableCard } from '../components/SelectableCard';
import { DotPattern } from '../components/Decorative';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

interface OnboardingGoalScreenProps {
  onNext: () => void;
}

const GOALS = [
  { id: 'public_speaking', label: 'PUBLIC SPEAKING', subtitle: 'Presentations, talks, speeches' },
  { id: 'interviews', label: 'JOB INTERVIEWS', subtitle: 'Nail your next interview' },
  { id: 'meetings', label: 'WORK MEETINGS', subtitle: 'Speak up with confidence at work' },
  { id: 'social', label: 'SOCIAL CONFIDENCE', subtitle: 'Feel at ease in conversations' },
];

export function OnboardingGoalScreen({ onNext }: OnboardingGoalScreenProps) {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <DotPattern rows={8} cols={6} style={{ top: 60, right: -20 }} />
        <StepIndicator currentStep={1} totalSteps={3} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>What are you training for</Text>
          <Text style={styles.subtitle}>We will build your plan around this</Text>
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
                <View style={styles.goalText}>
                  <Text style={styles.goalTitle}>{goal.label}</Text>
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
    backgroundColor: colors.background,
  },
  header: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.heading,
    color: colors.text,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.body,
    color: colors.textMuted,
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
  goalText: {
    flex: 1,
    gap: 2,
  },
  goalTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.body,
    color: colors.text,
    letterSpacing: 1,
  },
  goalSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.small,
    color: colors.textMuted,
  },
  bottom: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
});
