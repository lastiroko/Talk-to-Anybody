const API_BASE = 'http://localhost:3000/api/v1';

export async function createSession(mode: string, planDayId?: number) {
  // TODO: POST /sessions
  return { id: 'mock_session_' + Date.now(), status: 'queued' as const };
}

export async function getUploadUrl(sessionId: string) {
  // TODO: POST /sessions/:id/upload-url
  return {
    uploadUrl: 'https://mock-s3.example.com/upload',
    key: 'recordings/' + sessionId + '.m4a',
  };
}

export async function uploadRecording(uploadUrl: string, fileUri: string) {
  // TODO: Upload file to S3 using the presigned URL
  await new Promise<void>((resolve) => setTimeout(resolve, 1000));
  return { success: true };
}

export async function submitSession(sessionId: string) {
  // TODO: POST /sessions/:id/submit
  return { status: 'processing' as const };
}

export async function getSessionStatus(sessionId: string) {
  // TODO: GET /sessions/:id
  return { id: sessionId, status: 'done' as const };
}

export async function getAnalysis(sessionId: string) {
  // TODO: GET /sessions/:id/analysis
  return {
    scores: { overall: 65, delivery: 62, clarity: 68, story: 60 },
    metrics: { wpm: 148, fillerPerMin: 2.8, avgPauseSec: 0.6, pitchRangeHz: 78 },
    wins: ['Clear opening statement', 'Good eye contact with camera'],
    fixes: [
      { title: 'Replace fillers with pauses', drillId: 'pause_punch_01' },
      { title: 'Slow down during key points', drillId: 'pace_control_01' },
    ],
    coachingText:
      "Nice work! Your opening was strong and your pace was generally good. Focus on replacing those filler words with confident pauses \u2014 you're closer than you think.",
    reward: {
      format: 'full_scorecard' as const,
      content: null,
    },
  };
}

export async function submitAnxietyRating(
  sessionId: string,
  timing: 'pre' | 'post',
  rating: number,
) {
  // TODO: POST /sessions/:id/anxiety
  return { recorded: true };
}
