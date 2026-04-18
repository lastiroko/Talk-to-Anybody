import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { SettingsRow } from '../components/SettingsRow';
import { SettingsToggle } from '../components/SettingsToggle';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';
import { useProgress } from '../hooks/useProgress';

export function SettingsScreen() {
  const { progress, resetProgress } = useProgress();
  const currentDay = progress?.currentDayUnlocked ?? 1;

  const [dailyReminder, setDailyReminder] = useState(true);
  const [streakRescue, setStreakRescue] = useState(false);

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure? This will erase all your progress and start from Day 1. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => resetProgress(),
        },
      ],
    );
  };

  const comingSoon = (feature: string) => () =>
    Alert.alert('Coming soon', `${feature} will be available in a future update.`);

  return (
    <ScreenContainer padded={false} scroll={false}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile section */}
        <View style={styles.sectionCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>S</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>SpeakCoach User</Text>
              <Text style={styles.profileEmail}>user@example.com</Text>
              <TouchableOpacity onPress={comingSoon('Edit profile')}>
                <Text style={styles.editLink}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Plan section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>YOUR PLAN</Text>
          <SettingsRow label="Goal" value="Public Speaking" onPress={comingSoon('Goal editing')} />
          <View style={styles.separator} />
          <SettingsRow label="Daily time" value="10 min/day" onPress={comingSoon('Daily time editing')} />
          <View style={styles.separator} />
          <SettingsRow label="Current day" value={`Day ${currentDay} of 60`} />
        </View>

        {/* Subscription section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>SUBSCRIPTION</Text>
          <View style={styles.subRow}>
            <Text style={styles.subLabel}>Status</Text>
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>FREE TRIAL</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() =>
              Alert.alert(
                'Upgrade to Premium',
                '\u20ac5/month or \u20ac30 lifetime. Coming soon!',
              )
            }
            activeOpacity={0.7}
          >
            <Text style={styles.upgradeText}>Upgrade to Premium</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
          <SettingsRow
            label="Daily reminder"
            rightElement={
              <SettingsToggle value={dailyReminder} onToggle={() => setDailyReminder(!dailyReminder)} />
            }
          />
          <View style={styles.separator} />
          <SettingsRow
            label="Reminder time"
            value="9:00 AM"
            onPress={comingSoon('Time picker')}
          />
          <View style={styles.separator} />
          <SettingsRow
            label="Streak rescue"
            rightElement={
              <SettingsToggle value={streakRescue} onToggle={() => setStreakRescue(!streakRescue)} />
            }
          />
        </View>

        {/* Data section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>YOUR DATA</Text>
          <SettingsRow label="Export my data" onPress={comingSoon('Data export')} />
          <View style={styles.separator} />
          <SettingsRow label="Reset progress" destructive onPress={handleResetProgress} />
          <View style={styles.separator} />
          <SettingsRow
            label="Delete account"
            destructive
            onPress={() =>
              Alert.alert('Delete Account', 'Contact support@speakcoach.app to delete your account.')
            }
          />
        </View>

        {/* About section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <SettingsRow label="Version" value="0.1.0" />
          <View style={styles.separator} />
          <SettingsRow label="Terms of Service" onPress={comingSoon('Terms of Service')} />
          <View style={styles.separator} />
          <SettingsRow label="Privacy Policy" onPress={comingSoon('Privacy Policy')} />
          <View style={styles.separator} />
          <SettingsRow label="Send Feedback" onPress={comingSoon('Feedback form')} />
        </View>

        {/* Sign out */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={() =>
            Alert.alert(
              'Sign Out',
              'Sign out will be available when auth is connected.',
            )
          }
          activeOpacity={0.7}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },

  // Section card
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: typography.caption,
    fontFamily: typography.fontFamily.regular,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  separator: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.md,
  },

  // Profile
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontFamily: typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: typography.body,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text,
  },
  profileEmail: {
    fontSize: typography.caption,
    fontFamily: typography.fontFamily.regular,
    color: colors.textMuted,
  },
  editLink: {
    fontSize: typography.caption,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.primary,
    marginTop: 2,
  },

  // Subscription
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  subLabel: {
    fontSize: typography.body,
    fontFamily: typography.fontFamily.regular,
    color: colors.text,
  },
  freeBadge: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.borderAccent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 999,
  },
  freeBadgeText: {
    fontSize: typography.tiny,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.primary,
    letterSpacing: 1,
  },
  upgradeButton: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    marginTop: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  upgradeText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontFamily: typography.fontFamily.semiBold,
  },

  // Sign out
  signOutButton: {
    borderWidth: 1.5,
    borderColor: '#E63946',
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: typography.body,
    fontFamily: typography.fontFamily.semiBold,
    color: '#E63946',
  },

  bottomSpacer: { height: spacing.xl },
});
