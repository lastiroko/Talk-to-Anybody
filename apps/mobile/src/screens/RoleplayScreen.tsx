import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { RecordingPanel } from '../components/RecordingPanel';
import { PrimaryButton } from '../components/PrimaryButton';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { MainStackParamList } from '../navigation/types';
import { createSession, getUploadUrl, uploadRecording, submitSession } from '../services/api';

interface Scenario {
  id: string;
  icon: string;
  title: string;
  tagline: string;
  situation: string;
  yourRole: string;
  otherPerson: string;
  goal: string;
  suggestedTime: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'interview',
    icon: '\ud83d\udcbc',
    title: 'Job Interview',
    tagline: 'Answer common interview questions confidently',
    situation: 'You\'re in a final-round interview for your dream job. The interviewer has asked you to walk them through your biggest professional achievement.',
    yourRole: 'The candidate',
    otherPerson: 'A senior hiring manager',
    goal: 'Clearly articulate your value and leave a strong impression',
    suggestedTime: '2-3 minutes',
  },
  {
    id: 'toast',
    icon: '\ud83e\udd42',
    title: 'Wedding Toast',
    tagline: 'Give a heartfelt toast for a friend\'s wedding',
    situation: 'Your best friend just got married and it\'s your turn to give the toast. The room is full of family and friends waiting to hear your words.',
    yourRole: 'The best man/maid of honor',
    otherPerson: 'A room of 100 guests',
    goal: 'Make the couple feel loved and get a few laughs',
    suggestedTime: '2-3 minutes',
  },
  {
    id: 'presentation',
    icon: '\ud83d\udcca',
    title: 'Team Presentation',
    tagline: 'Present project updates to your team',
    situation: 'It\'s the weekly team sync and you need to update everyone on your project\'s progress, including a problem you\'ve hit and your proposed solution.',
    yourRole: 'Project lead',
    otherPerson: 'Your team of 8 colleagues',
    goal: 'Communicate status clearly and get buy-in on your solution',
    suggestedTime: '2-3 minutes',
  },
  {
    id: 'difficult',
    icon: '\ud83e\udd1d',
    title: 'Difficult Conversation',
    tagline: 'Have a tough but respectful conversation',
    situation: 'A colleague has been consistently taking credit for your ideas in meetings. You need to address this directly but professionally.',
    yourRole: 'Yourself',
    otherPerson: 'A colleague you otherwise get along with',
    goal: 'Set a clear boundary while preserving the relationship',
    suggestedTime: '2-3 minutes',
  },
  {
    id: 'award',
    icon: '\ud83c\udfa4',
    title: 'Award Acceptance',
    tagline: 'Accept an award gracefully',
    situation: 'You\'ve just been called to the stage to receive an award for your work. You have about 90 seconds before the music plays you off.',
    yourRole: 'The award recipient',
    otherPerson: 'An audience of 500 people',
    goal: 'Be genuine, grateful, and memorable',
    suggestedTime: '1-2 minutes',
  },
  {
    id: 'cold_call',
    icon: '\ud83d\udcde',
    title: 'Cold Call',
    tagline: 'Pitch a product or idea to a stranger',
    situation: 'You\'re calling a potential client who has never heard of you or your company. You have 60 seconds to hook their interest.',
    yourRole: 'Sales representative',
    otherPerson: 'A busy decision-maker',
    goal: 'Get them to agree to a 15-minute demo call',
    suggestedTime: '1-2 minutes',
  },
];

export function RoleplayScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [recordingDone, setRecordingDone] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  const handleSelect = (id: string) => {
    setSelectedId(selectedId === id ? null : id);
    setRecordingDone(false);
    setKey((k) => k + 1);
  };

  const handleComplete = (uri: string, durationSec: number) => {
    setRecordingUri(uri);
    setRecordingDone(true);
  };

  const handleAnalyze = async () => {
    if (!recordingUri) return;
    const session = await createSession('roleplay');
    const { uploadUrl } = await getUploadUrl(session.id);
    await uploadRecording(uploadUrl, recordingUri);
    await submitSession(session.id);
    navigation.navigate('AnalysisResult', { sessionId: session.id });
  };

  return (
    <ScreenContainer padded={false} scroll={false}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Roleplay Scenarios</Text>
          <Text style={styles.subtitle}>Practice real-world speaking situations.</Text>
        </View>

        {/* Scenario cards */}
        {SCENARIOS.map((scenario) => {
          const isSelected = selectedId === scenario.id;
          return (
            <View key={scenario.id}>
              <TouchableOpacity
                style={[styles.scenarioCard, isSelected && styles.scenarioSelected]}
                onPress={() => handleSelect(scenario.id)}
                activeOpacity={0.7}
              >
                <View style={styles.scenarioHeader}>
                  <Text style={styles.scenarioIcon}>{scenario.icon}</Text>
                  <View style={styles.scenarioText}>
                    <Text style={styles.scenarioTitle}>{scenario.title}</Text>
                    <Text style={styles.scenarioTagline}>{scenario.tagline}</Text>
                  </View>
                  <Text style={styles.chevron}>{isSelected ? '\u25b2' : '\u25bc'}</Text>
                </View>

                {isSelected ? (
                  <View style={styles.scenarioDetails}>
                    <Text style={styles.detailText}>{scenario.situation}</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Your role:</Text>
                      <Text style={styles.detailValue}>{scenario.yourRole}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>The other person:</Text>
                      <Text style={styles.detailValue}>{scenario.otherPerson}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Goal:</Text>
                      <Text style={styles.detailValue}>{scenario.goal}</Text>
                    </View>
                    <Text style={styles.suggestedTime}>
                      Suggested time: {scenario.suggestedTime}
                    </Text>
                  </View>
                ) : null}
              </TouchableOpacity>

              {isSelected ? (
                <View style={styles.recordingSection}>
                  <RecordingPanel
                    key={key}
                    maxDurationSec={180}
                    onRecordingComplete={handleComplete}
                    onDiscard={() => setRecordingDone(false)}
                  />
                  {recordingDone ? (
                    <PrimaryButton title="Save & Analyze" onPress={handleAnalyze} />
                  ) : null}
                </View>
              ) : null}
            </View>
          );
        })}
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
  header: {
    gap: spacing.xs,
  },
  title: {
    fontSize: typography.heading,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.body,
    fontFamily: typography.fontFamily.regular,
    color: colors.muted,
  },
  scenarioCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: spacing.md,
  },
  scenarioSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(255,69,0,0.06)',
  },
  scenarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  scenarioIcon: {
    fontSize: 28,
  },
  scenarioText: {
    flex: 1,
    gap: 2,
  },
  scenarioTitle: {
    fontSize: typography.body,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  scenarioTagline: {
    fontSize: typography.small,
    color: colors.muted,
  },
  chevron: {
    fontSize: 12,
    color: '#8A8A8A',
  },
  scenarioDetails: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  detailText: {
    fontSize: typography.body,
    color: colors.text,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  detailLabel: {
    fontSize: typography.small,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  detailValue: {
    fontSize: typography.small,
    color: colors.muted,
    flex: 1,
  },
  suggestedTime: {
    fontSize: typography.small,
    color: colors.primary,
    fontWeight: typography.weightSemi,
  },
  recordingSection: {
    marginTop: spacing.sm,
    gap: spacing.md,
  },
});
