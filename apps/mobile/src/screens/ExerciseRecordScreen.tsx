import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { RecordingPanel } from '../components/RecordingPanel';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { MainStackParamList } from '../navigation/types';
import { createSession, getUploadUrl, uploadRecording, submitSession } from '../services/api';

const TYPE_CONFIG: Record<string, { bg: string; border: string; label: string }> = {
  record: { bg: '#dbeafe', border: '#93c5fd', label: 'Record' },
  drill: { bg: '#ffedd5', border: '#fdba74', label: 'Drill' },
  reflection: { bg: '#f3e8ff', border: '#c4b5fd', label: 'Reflection' },
  game: { bg: '#dcfce7', border: '#86efac', label: 'Game' },
  unlearning_drill: { bg: '#ffe4e6', border: '#fda4af', label: 'Unlearning' },
  imitation_drill: { bg: '#ccfbf1', border: '#5eead4', label: 'Imitation' },
};

export function ExerciseRecordScreen() {
  const route = useRoute<RouteProp<MainStackParamList, 'ExerciseRecord'>>();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { exercise, dayNumber } = route.params;
  const config = TYPE_CONFIG[exercise.type] ?? { bg: colors.surface, border: colors.border, label: exercise.type };

  const [analyzing, setAnalyzing] = useState(false);

  const handleRecordingComplete = async (uri: string, durationSec: number) => {
    setAnalyzing(true);

    try {
      // Mock API flow
      const session = await createSession('plan_day', dayNumber);
      const { uploadUrl } = await getUploadUrl(session.id);
      await uploadRecording(uploadUrl, uri);
      await submitSession(session.id);

      // Simulate analysis delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setAnalyzing(false);
      navigation.replace('AnalysisResult', {
        sessionId: session.id,
        exerciseId: exercise.id,
        dayNumber,
      });
    } catch {
      setAnalyzing(false);
    }
  };

  if (analyzing) {
    return (
      <ScreenContainer>
        <View style={styles.analyzingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.analyzingTitle}>Analyzing your recording...</Text>
          <Text style={styles.analyzingSubtitle}>
            Our AI is listening for pace, pauses, fillers, and more.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Exercise info */}
        <View style={[styles.exerciseCard, { backgroundColor: config.bg, borderColor: config.border }]}>
          <View style={[styles.badge, { backgroundColor: config.border }]}>
            <Text style={styles.badgeText}>{config.label}</Text>
          </View>
          <Text style={styles.prompt}>{exercise.prompt}</Text>
          {exercise.instructions ? (
            <Text style={styles.instructions}>{exercise.instructions}</Text>
          ) : null}
          <Text style={styles.durationHint}>
            Target: {exercise.durationSec}s
            {exercise.maxDurationSec ? ` (max ${exercise.maxDurationSec}s)` : ''}
          </Text>
        </View>

        {/* Recording panel */}
        <RecordingPanel
          maxDurationSec={exercise.maxDurationSec ?? exercise.durationSec * 2}
          minDurationSec={Math.min(5, exercise.durationSec)}
          onRecordingComplete={handleRecordingComplete}
          onDiscard={() => navigation.goBack()}
          showPlayback
          showPauseResume
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  exerciseCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: typography.small,
    fontWeight: typography.weightSemi,
    color: '#fff',
  },
  prompt: {
    fontSize: typography.body,
    color: colors.text,
    lineHeight: 24,
    fontWeight: typography.weightSemi,
  },
  instructions: {
    fontSize: typography.small,
    color: colors.muted,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  durationHint: {
    fontSize: typography.small,
    color: colors.muted,
    fontWeight: typography.weightSemi,
  },
  analyzingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    padding: spacing.xl,
  },
  analyzingTitle: {
    fontSize: typography.heading,
    fontWeight: typography.weightBold,
    color: colors.text,
    textAlign: 'center',
  },
  analyzingSubtitle: {
    fontSize: typography.body,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
