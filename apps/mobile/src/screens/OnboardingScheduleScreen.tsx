import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { StepIndicator } from '../components/StepIndicator';
import { SelectableCard } from '../components/SelectableCard';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

interface OnboardingScheduleScreenProps {
  onNext: () => void;
}

const TIME_OPTIONS = [
  { id: '5', emoji: '\u26a1', minutes: '5 min', subtitle: 'Quick daily boost', badge: null },
  { id: '10', emoji: '\ud83d\udd25', minutes: '10 min', subtitle: 'Recommended', badge: 'Best value' },
  { id: '15', emoji: '\ud83d\udcaa', minutes: '15 min', subtitle: 'Maximum growth', badge: null },
];

export function OnboardingScheduleScreen({ onNext }: OnboardingScheduleScreenProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reminderOn, setReminderOn] = useState(false);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <StepIndicator currentStep={2} totalSteps={3} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>How much time per day?</Text>
          <Text style={styles.subtitle}>Even 5 minutes makes a real difference</Text>
        </View>

        {/* Time cards */}
        <View style={styles.options}>
          {TIME_OPTIONS.map((option) => (
            <SelectableCard
              key={option.id}
              selected={selectedTime === option.id}
              onPress={() => setSelectedTime(option.id)}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <View style={styles.optionText}>
                  <View style={styles.optionTitleRow}>
                    <Text style={styles.optionMinutes}>{option.minutes}</Text>
                    {option.badge ? (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{option.badge}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
              </View>
            </SelectableCard>
          ))}
        </View>

        <Text style={styles.changeHint}>You can change this anytime in Settings</Text>

        {/* Reminder toggle */}
        <View style={styles.reminderSection}>
          <TouchableOpacity
            style={styles.reminderRow}
            onPress={() => setReminderOn(!reminderOn)}
            activeOpacity={0.7}
          >
            <Text style={styles.reminderLabel}>Set a daily reminder?</Text>
            <View style={[styles.toggle, reminderOn && styles.toggleOn]}>
              <View style={[styles.toggleKnob, reminderOn && styles.toggleKnobOn]} />
            </View>
          </TouchableOpacity>
          {reminderOn ? (
            <View style={styles.reminderInfo}>
              <Text style={styles.reminderTime}>9:00 AM</Text>
              <Text style={styles.reminderNote}>(You can change this in Settings)</Text>
            </View>
          ) : null}
        </View>

        {/* Continue */}
        <View style={styles.bottom}>
          <PrimaryButton
            title="Continue"
            onPress={onNext}
            disabled={!selectedTime}
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
  options: {
    gap: spacing.md,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  optionEmoji: {
    fontSize: 28,
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  optionMinutes: {
    fontSize: typography.subheading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  optionSubtitle: {
    fontSize: typography.small,
    color: colors.muted,
  },
  badge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: typography.weightBold,
    color: '#b45309',
  },
  changeHint: {
    fontSize: typography.small,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  reminderSection: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reminderLabel: {
    fontSize: typography.body,
    fontWeight: typography.weightSemi,
    color: colors.text,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleOn: {
    backgroundColor: colors.primary,
  },
  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
  },
  toggleKnobOn: {
    alignSelf: 'flex-end',
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  reminderTime: {
    fontSize: typography.body,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  reminderNote: {
    fontSize: typography.small,
    color: colors.muted,
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
});
