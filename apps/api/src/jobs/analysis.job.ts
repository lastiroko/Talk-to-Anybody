import type { PrismaClient } from '@prisma/client';
import { transcribeAudio } from '../services/stt.service';
import { analyzeAudioMetrics } from '../services/audio-analysis.service';
import { generateCoaching } from '../services/coaching.service';
import { selectRewardFormat, generateRewardContent } from '../services/rewards.service';

interface AnalysisJobData {
  sessionId: string;
}

/**
 * Process a speech analysis job.
 * When REDIS_URL is available, this runs as a BullMQ worker.
 * Otherwise, it runs synchronously inline.
 */
export async function processAnalysisJob(
  prisma: PrismaClient,
  data: AnalysisJobData,
  config: { deepgramApiKey: string; anthropicApiKey: string },
): Promise<void> {
  const { sessionId } = data;

  try {
    // 1. Update status to processing
    await prisma.session.update({
      where: { id: sessionId },
      data: { status: 'processing' },
    });

    // 2. Fetch session and recording
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { recordings: true },
    });

    if (!session) throw new Error(`Session ${sessionId} not found`);

    const recording = session.recordings[0];
    const audioUrl = recording?.audioUrl || '';

    // 3. Speech-to-text
    const sttResult = await transcribeAudio(audioUrl, config.deepgramApiKey);

    // 4. Audio metrics extraction
    const audioMetrics = analyzeAudioMetrics(sttResult.words, sttResult.durationSec);

    // 5. LLM coaching / scoring
    const coaching = await generateCoaching(
      sttResult.transcript,
      audioMetrics,
      session.mode,
      config.anthropicApiKey,
    );

    // 6. Reward selection
    const rewardFormat = await selectRewardFormat(prisma, session.userId, ['full_scorecard']);
    const rewardContent = await generateRewardContent(
      prisma,
      session.userId,
      sessionId,
      rewardFormat,
    );

    // 7. Store analysis result
    // Pack wins, fixes, and tags into scoresJson alongside score numbers
    await prisma.analysisResult.create({
      data: {
        sessionId,
        transcriptText: sttResult.transcript,
        transcriptWordsJson: sttResult.words as any,
        metricsJson: {
          wpm: audioMetrics.wpm,
          fillerPerMin: audioMetrics.fillerPerMin,
          avgPauseSec: audioMetrics.avgPauseSec,
          pitchRangeHz: audioMetrics.pitchRangeHz,
          vocalVariety: audioMetrics.vocalVariety,
        },
        scoresJson: {
          overall: coaching.scores.overall,
          delivery: coaching.scores.delivery,
          clarity: coaching.scores.clarity,
          story: coaching.scores.story,
          wins: coaching.wins,
          fixes: coaching.fixes,
          tags: coaching.tags,
        },
        coachingText: coaching.coachingText,
        habitMarkersJson: audioMetrics.fillerWords as any,
        rewardFormat: rewardFormat as any,
        rewardContentJson: rewardContent as any,
      },
    });

    // 8. Update session status to done + duration
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        status: 'done',
        durationSec: Math.round(sttResult.durationSec),
      },
    });
  } catch (error) {
    // Mark session as error
    await prisma.session
      .update({
        where: { id: sessionId },
        data: { status: 'error' },
      })
      .catch(() => {}); // ignore if session doesn't exist
    throw error;
  }
}
