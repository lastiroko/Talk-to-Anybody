import OpenAI from 'openai';

interface AudioMetrics {
  wpm: number;
  fillerPerMin: number;
  avgPauseSec: number;
  pitchRangeHz: number;
  vocalVariety: number;
  totalFillers: number;
}

interface CoachingResult {
  scores: { overall: number; delivery: number; clarity: number; story: number };
  wins: string[];
  fixes: { title: string; drillId: string }[];
  tags: string[];
  coachingText: string;
}

export async function generateCoaching(
  transcript: string,
  metrics: AudioMetrics,
  mode: string,
  apiKey: string,
): Promise<CoachingResult> {
  if (!apiKey) {
    return generateMockCoaching(metrics);
  }

  const openai = new OpenAI({ apiKey });

  const systemPrompt = `You are an expert public speaking coach. Analyze the following speech transcript and audio metrics. Return a JSON object with:
- scores: { overall: 0-100, delivery: 0-100, clarity: 0-100, story: 0-100 }
- wins: array of 2-3 specific things the speaker did well (strings)
- fixes: array of 2-3 improvement areas, each with { title: string, drillId: string } where drillId is one of: pause_punch_01, pace_control_01, structure_drill_01, clarity_drill_01, vocal_variety_01, filler_swap_01, storytelling_01
- tags: array of 3-5 skill tags like "clear-opener", "good-pacing", "needs-pauses", etc.
- coachingText: 2-3 sentence encouraging coaching message

Consider the speaking mode: ${mode}. Be specific and constructive.`;

  const userPrompt = `Transcript: "${transcript}"

Metrics:
- Words per minute: ${metrics.wpm}
- Filler words per minute: ${metrics.fillerPerMin}
- Average pause length: ${metrics.avgPauseSec}s
- Pitch range: ${metrics.pitchRangeHz}Hz
- Vocal variety score: ${metrics.vocalVariety}/100
- Total filler words: ${metrics.totalFillers}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 800,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) return generateMockCoaching(metrics);

  try {
    const parsed = JSON.parse(content);
    return {
      scores: {
        overall: clamp(parsed.scores?.overall ?? 65),
        delivery: clamp(parsed.scores?.delivery ?? 62),
        clarity: clamp(parsed.scores?.clarity ?? 68),
        story: clamp(parsed.scores?.story ?? 60),
      },
      wins: (parsed.wins ?? []).slice(0, 3),
      fixes: (parsed.fixes ?? []).slice(0, 3).map((f: any) => ({
        title: f.title || 'Practice more',
        drillId: f.drillId || 'pace_control_01',
      })),
      tags: (parsed.tags ?? []).slice(0, 5),
      coachingText: parsed.coachingText || "Keep practicing! You're making progress.",
    };
  } catch {
    return generateMockCoaching(metrics);
  }
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function generateMockCoaching(metrics: AudioMetrics): CoachingResult {
  const deliveryScore = metrics.wpm >= 120 && metrics.wpm <= 160 ? 70 : 55;
  const clarityScore = metrics.fillerPerMin < 3 ? 72 : 58;
  const storyScore = 60 + Math.floor(Math.random() * 15);
  const overall = Math.round((deliveryScore + clarityScore + storyScore) / 3);

  const wins: string[] = [];
  if (metrics.wpm >= 120 && metrics.wpm <= 160) wins.push('Good speaking pace');
  if (metrics.fillerPerMin < 2) wins.push('Minimal filler words');
  if (metrics.avgPauseSec > 0.5) wins.push('Effective use of pauses');
  if (wins.length === 0) wins.push('Completed the exercise');
  wins.push('Consistent effort in practice');

  const fixes: { title: string; drillId: string }[] = [];
  if (metrics.fillerPerMin >= 2)
    fixes.push({ title: 'Replace filler words with pauses', drillId: 'filler_swap_01' });
  if (metrics.wpm > 160)
    fixes.push({ title: 'Slow down during key points', drillId: 'pace_control_01' });
  if (metrics.avgPauseSec < 0.5)
    fixes.push({ title: 'Add strategic pauses', drillId: 'pause_punch_01' });
  if (fixes.length === 0)
    fixes.push({ title: 'Work on story structure', drillId: 'structure_drill_01' });

  return {
    scores: { overall, delivery: deliveryScore, clarity: clarityScore, story: storyScore },
    wins: wins.slice(0, 3),
    fixes: fixes.slice(0, 3),
    tags: ['practice-session', metrics.wpm > 150 ? 'fast-pace' : 'steady-pace'],
    coachingText: `Nice work! Your pace was ${metrics.wpm} WPM which is ${metrics.wpm >= 120 && metrics.wpm <= 160 ? 'right in the sweet spot' : 'a bit off target'}. Focus on ${metrics.fillerPerMin >= 2 ? 'replacing fillers with confident pauses' : 'maintaining your great clarity'} — you're making real progress.`,
  };
}
