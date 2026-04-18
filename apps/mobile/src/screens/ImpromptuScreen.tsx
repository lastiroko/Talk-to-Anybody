import { useState, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

const PROMPTS = [
  "What's the most overrated thing in modern life?",
  'If you could have dinner with anyone in history, who and why?',
  "What's the biggest misconception about your field?",
  'Convince me to try your favorite hobby.',
  'What would you change about the education system?',
  'Describe your perfect day from start to finish.',
  "What's one thing everyone should learn to do?",
  'If you had to give a TED talk tomorrow, what would it be about?',
  "What's the best advice you've ever ignored?",
  'Explain something complex in simple terms.',
  "What's a hill you'll die on?",
  'Tell me about a time you were completely wrong.',
  'What makes a great leader?',
  'If you could solve one world problem, which one?',
  "What's the most useful skill nobody teaches in school?",
  "Pitch a terrible business idea as if it's brilliant.",
  'What would your TED talk title be?',
  'Describe yourself in 30 seconds to a stranger.',
  "What's something you changed your mind about?",
  'If aliens visited Earth, what would you show them first?',
];

export function ImpromptuScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [promptIndex, setPromptIndex] = useState(
    () => Math.floor(Math.random() * PROMPTS.length),
  );
  const [recordingDone, setRecordingDone] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  const shufflePrompt = useCallback(() => {
    setPromptIndex((prev) => {
      let next = Math.floor(Math.random() * PROMPTS.length);
      while (next === prev && PROMPTS.length > 1) {
        next = Math.floor(Math.random() * PROMPTS.length);
      }
      return next;
    });
    setRecordingDone(false);
    setKey((k) => k + 1);
  }, []);

  const handleComplete = (uri: string, durationSec: number) => {
    setRecordingUri(uri);
    setRecordingDone(true);
  };

  const handleAnalyze = async () => {
    if (!recordingUri) return;
    const session = await createSession('impromptu');
    const { uploadUrl } = await getUploadUrl(session.id);
    await uploadRecording(uploadUrl, recordingUri);
    await submitSession(session.id);
    navigation.navigate('AnalysisResult', { sessionId: session.id });
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Impromptu Challenge</Text>
          <Text style={styles.subtitle}>Zero prep. Think on your feet.</Text>
        </View>

        {/* New prompt button */}
        <TouchableOpacity onPress={shufflePrompt} style={styles.shuffleButton}>
          <Text style={styles.shuffleText}>{'\ud83d\udd04'} New Prompt</Text>
        </TouchableOpacity>

        <Text style={styles.timerNote}>60 seconds \u2014 3-second countdown, then go!</Text>

        {/* Recording panel with countdown and prompt */}
        <RecordingPanel
          key={key}
          maxDurationSec={60}
          countdownSeconds={3}
          promptText={PROMPTS[promptIndex]}
          onRecordingComplete={handleComplete}
          onDiscard={() => setRecordingDone(false)}
        />

        {recordingDone ? (
          <PrimaryButton title="Save & Analyze" onPress={handleAnalyze} />
        ) : null}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.md,
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
  shuffleButton: {
    alignSelf: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'rgba(255,69,0,0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,69,0,0.3)',
  },
  shuffleText: {
    fontSize: typography.body,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.primary,
    fontWeight: typography.weightSemi,
  },
  timerNote: {
    fontSize: typography.small,
    fontFamily: typography.fontFamily.regular,
    color: colors.muted,
    textAlign: 'center',
  },
});
