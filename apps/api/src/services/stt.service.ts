import { createClient } from '@deepgram/sdk';

interface TranscriptWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
}

interface SttResult {
  transcript: string;
  words: TranscriptWord[];
  durationSec: number;
}

export async function transcribeAudio(audioUrl: string, apiKey: string): Promise<SttResult> {
  if (!apiKey) {
    // Mock fallback when no API key
    return {
      transcript:
        'This is a mock transcript for development. The user spoke about their topic with reasonable clarity and some filler words like um and uh scattered throughout.',
      words: generateMockWords(),
      durationSec: 60,
    };
  }

  const deepgram = createClient(apiKey);
  const { result } = await deepgram.listen.prerecorded.transcribeUrl(
    { url: audioUrl },
    {
      model: 'nova-2',
      smart_format: true,
      utterances: true,
      punctuate: true,
      diarize: false,
    },
  );

  const channel = result!.results.channels[0];
  const alternative = channel.alternatives[0];

  const words: TranscriptWord[] = alternative.words.map((w: any) => ({
    word: w.punctuated_word || w.word,
    start: w.start,
    end: w.end,
    confidence: w.confidence,
  }));

  return {
    transcript: alternative.transcript,
    words,
    durationSec: result!.metadata?.duration || 0,
  };
}

function generateMockWords(): TranscriptWord[] {
  const text =
    'This is a mock transcript for development The user spoke about their topic with reasonable clarity and some filler words like um and uh scattered throughout';
  return text.split(' ').map((word, i) => ({
    word,
    start: i * 0.4,
    end: i * 0.4 + 0.35,
    confidence: 0.92 + Math.random() * 0.08,
  }));
}
