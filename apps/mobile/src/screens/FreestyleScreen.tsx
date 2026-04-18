import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

const DURATION_OPTIONS = [
  { label: '1 min', seconds: 60 },
  { label: '2 min', seconds: 120 },
  { label: '5 min', seconds: 300 },
];

export function FreestyleScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [selectedDuration, setSelectedDuration] = useState(120);
  const [recordingDone, setRecordingDone] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  const handleComplete = async (uri: string, durationSec: number) => {
    setRecordingUri(uri);
    setRecordingDone(true);
  };

  const handleAnalyze = async () => {
    if (!recordingUri) return;
    const session = await createSession('freestyle');
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
          <Text style={styles.title}>Freestyle Practice</Text>
          <Text style={styles.subtitle}>
            Talk about anything. No prompt, no rules.
          </Text>
        </View>

        {/* Timer selector */}
        <View style={styles.pills}>
          {DURATION_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.seconds}
              style={[
                styles.pill,
                selectedDuration === opt.seconds && styles.pillActive,
              ]}
              onPress={() => {
                setSelectedDuration(opt.seconds);
                setRecordingDone(false);
                setKey((k) => k + 1);
              }}
            >
              <Text
                style={[
                  styles.pillText,
                  selectedDuration === opt.seconds && styles.pillTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recording panel */}
        <RecordingPanel
          key={key}
          maxDurationSec={selectedDuration}
          onRecordingComplete={handleComplete}
          onDiscard={() => setRecordingDone(false)}
        />

        {/* After recording actions */}
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
  pills: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  pillActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(255,69,0,0.1)',
  },
  pillText: {
    fontSize: typography.body,
    fontFamily: typography.fontFamily.regular,
    fontWeight: typography.weightSemi,
    color: colors.muted,
  },
  pillTextActive: {
    color: colors.primary,
  },
});
