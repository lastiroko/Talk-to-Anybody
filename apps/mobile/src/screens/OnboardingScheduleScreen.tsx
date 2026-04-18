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
  { id: '5', minutes: '5 MIN', subtitle: 'Quick daily session', badge: null },
  { id: '10', minutes: '10 MIN', subtitle: 'Recommended', badge: 'BEST VALUE' },
  { id: '15', minutes: '15 MIN', subtitle: 'Maximum growth', badge: null },
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
          <Text style={styles.title}>Daily time commitment</Text>
          <Text style={styles.subtitle}>Even 5 minutes moves the needle</Text>
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
            <Text style={styles.reminderLabel}>Daily reminder</Text>
            <View style={[styles.toggle, reminderOn && styles.toggleOn]}>
              <View style={[styles.toggleKnob, reminderOn && styles.toggleKnobOn]} />
            </View>
          </TouchableOpacity>
          {reminderOn ? (
            <View style={styles.reminderInfo}>
              <Text style={styles.reminderTime}>9:00 AM</Text>
              <Text style={styles.reminderNote}>(Change in Settings)</Text>
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
  options: {
    gap: spacing.md,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
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
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.subheading,
    color: colors.text,
    letterSpacing: 1,
  },
  optionSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.small,
    color: colors.textMuted,
  },
  badge: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  badgeText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 1,
  },
  changeHint: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.small,
    color: colors.textLight,
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
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.body,
    color: colors.text,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
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
    backgroundColor: '#FFFFFF',
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
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.body,
    color: colors.text,
  },
  reminderNote: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.small,
    color: colors.textLight,
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
});
