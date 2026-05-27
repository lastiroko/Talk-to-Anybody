import { Alert, Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { ModeCard } from '../components/ModeCard';
import { GameCard } from '../components/GameCard';
import { useEntryAnimation } from '../hooks/useEntryAnimation';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { useProgress } from '../hooks/useProgress';
import { usePaywallGate } from '../hooks/usePaywallGate';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';

type PracticeNavigation = NativeStackNavigationProp<MainStackParamList>;

const GAME_UNLOCK_DAYS: Record<string, number> = {
  abt_builder: 1,
  filler_swap: 3,
  pause_punch: 5,
  clarity_sprint: 7,
};

export function PracticeScreen() {
  const navigation = useNavigation<PracticeNavigation>();
  const { progress } = useProgress();
  const { isGated } = usePaywallGate();
  const { fadeIn } = useEntryAnimation(4);

  const currentDay = progress?.currentDayUnlocked ?? 1;
  const isGameUnlocked = (gameId: string) => currentDay >= GAME_UNLOCK_DAYS[gameId];

  return (
    <ScreenContainer padded={false} scroll={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View style={[styles.header, fadeIn(0)]}>
          <Text style={styles.headerCaption}>PRACTICE</Text>
          <Text style={styles.title}>Train any skill, anytime.</Text>
        </Animated.View>

        {/* Practice Modes */}
        <Animated.View style={[styles.section, fadeIn(1)]}>
          <Text style={styles.sectionCaption}>PRACTICE MODES</Text>
        </Animated.View>

        <Animated.View style={[styles.modes, fadeIn(2)]}>
          <ModeCard
            icon="mic-outline"
            iconColor={colors.primary}
            title="Freestyle"
            description="Talk about anything. No prompt, no rules. Just practice."
            onPress={() => navigation.navigate('Freestyle')}
          />
          <ModeCard
            icon="document-text-outline"
            iconColor={colors.categoryPurple}
            title="Script Mode"
            description="Paste your script and practice delivering it."
            onPress={() =>
              isGated() ? navigation.navigate('Paywall') : navigation.navigate('ScriptMode')
            }
          />
          <ModeCard
            icon="flash-outline"
            iconColor={colors.categoryOrange}
            title="Impromptu"
            description="Random prompt. Zero prep. Think on your feet."
            onPress={() =>
              isGated() ? navigation.navigate('Paywall') : navigation.navigate('Impromptu')
            }
          />
          <ModeCard
            icon="people-outline"
            iconColor={colors.teal}
            title="Roleplay"
            description="Practice real scenarios: interviews, toasts, pitches."
            onPress={() =>
              isGated() ? navigation.navigate('Paywall') : navigation.navigate('Roleplay')
            }
          />
        </Animated.View>

        {/* Mini-Games */}
        <Animated.View style={[styles.section, fadeIn(3)]}>
          <Text style={styles.sectionCaption}>MINI-GAMES</Text>
          <View style={styles.gameGrid}>
            <View style={styles.gameRow}>
              <GameCard
                icon="swap-horizontal-outline"
                iconColor={colors.categoryOrange}
                title="Filler Swap"
                description="Replace fillers with power words"
                locked={!isGameUnlocked('filler_swap')}
                unlockDay={GAME_UNLOCK_DAYS.filler_swap}
                onPress={() =>
                  isGated() ? navigation.navigate('Paywall') : navigation.navigate('FillerSwap')
                }
              />
              <GameCard
                icon="pause-circle-outline"
                iconColor={colors.teal}
                title="Pause Punch"
                description="Hit the perfect pause timing"
                locked={!isGameUnlocked('pause_punch')}
                unlockDay={GAME_UNLOCK_DAYS.pause_punch}
                onPress={() =>
                  isGated() ? navigation.navigate('Paywall') : navigation.navigate('PausePunch')
                }
              />
            </View>
            <View style={styles.gameRow}>
              <GameCard
                icon="book-outline"
                iconColor={colors.gold}
                title="ABT Builder"
                description="Construct compelling story structures"
                locked={!isGameUnlocked('abt_builder')}
                unlockDay={GAME_UNLOCK_DAYS.abt_builder}
                onPress={() =>
                  isGated() ? navigation.navigate('Paywall') : navigation.navigate('ABTBuilder')
                }
              />
              <GameCard
                icon="diamond-outline"
                iconColor={colors.categoryPurple}
                title="Clarity Sprint"
                description="Simplify complex ideas fast"
                locked={!isGameUnlocked('clarity_sprint')}
                unlockDay={GAME_UNLOCK_DAYS.clarity_sprint}
                onPress={() =>
                  isGated() ? navigation.navigate('Paywall') : navigation.navigate('ClaritySprint')
                }
              />
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: { gap: 6 },
  headerCaption: {
    fontSize: typography.caption,
    fontFamily: typography.fontFamily.regular,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: typography.heading,
    fontFamily: typography.fontFamily.display,
    color: colors.text,
  },
  section: { gap: spacing.md },
  sectionCaption: {
    fontSize: typography.caption,
    fontFamily: typography.fontFamily.regular,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  modes: { gap: spacing.md },
  gameGrid: { gap: spacing.md },
  gameRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
