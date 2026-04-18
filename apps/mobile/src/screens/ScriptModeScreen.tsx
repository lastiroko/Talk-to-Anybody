import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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

export function ScriptModeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [script, setScript] = useState('');
  const [teleprompterOn, setTeleprompterOn] = useState(false);
  const [recordingDone, setRecordingDone] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  const wordCount = script.trim() ? script.trim().split(/\s+/).length : 0;

  const handleComplete = (uri: string, durationSec: number) => {
    setRecordingUri(uri);
    setRecordingDone(true);
  };

  const handleAnalyze = async () => {
    if (!recordingUri) return;
    const session = await createSession('script');
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
          <Text style={styles.title}>Script Mode</Text>
          <Text style={styles.subtitle}>
            Paste your script and practice delivering it.
          </Text>
        </View>

        {/* Script input */}
        <View style={styles.inputArea}>
          <TextInput
            style={styles.textInput}
            value={script}
            onChangeText={setScript}
            placeholder="Paste or type your script here..."
            placeholderTextColor={colors.muted}
            multiline
            textAlignVertical="top"
          />
          <Text style={styles.wordCount}>{wordCount} words</Text>
        </View>

        {/* Teleprompter toggle */}
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setTeleprompterOn(!teleprompterOn)}
          activeOpacity={0.7}
        >
          <Text style={styles.toggleLabel}>Show as teleprompter while recording</Text>
          <View style={[styles.toggle, teleprompterOn && styles.toggleOn]}>
            <View style={[styles.toggleKnob, teleprompterOn && styles.toggleKnobOn]} />
          </View>
        </TouchableOpacity>

        {/* Teleprompter view */}
        {teleprompterOn && script ? (
          <View style={styles.teleprompter}>
            <Text style={styles.teleprompterText}>{script}</Text>
          </View>
        ) : null}

        {/* Recording panel */}
        <RecordingPanel
          key={key}
          maxDurationSec={300}
          onRecordingComplete={handleComplete}
          onDiscard={() => setRecordingDone(false)}
        />

        {recordingDone ? (
          <PrimaryButton title="Save & Analyze" onPress={handleAnalyze} />
        ) : null}
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
  inputArea: {
    gap: spacing.xs,
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: typography.body,
    fontFamily: typography.fontFamily.regular,
    color: colors.text,
    backgroundColor: colors.surfaceMuted,
    minHeight: 140,
    lineHeight: 22,
  },
  wordCount: {
    fontSize: typography.small,
    fontFamily: typography.fontFamily.regular,
    color: colors.muted,
    textAlign: 'right',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleLabel: {
    fontSize: typography.small,
    fontFamily: typography.fontFamily.semiBold,
    fontWeight: typography.weightSemi,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    backgroundColor: '#FFFFFF',
  },
  toggleKnobOn: {
    alignSelf: 'flex-end',
  },
  teleprompter: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.lg,
    maxHeight: 150,
    borderWidth: 1,
    borderColor: colors.border,
  },
  teleprompterText: {
    fontSize: typography.subheading,
    fontFamily: typography.fontFamily.regular,
    color: colors.text,
    lineHeight: 28,
  },
});
