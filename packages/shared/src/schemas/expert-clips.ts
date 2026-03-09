import { z } from 'zod';
import { TechniqueTypeSchema } from '../enums';

// ── Pace Profile ────────────────────────────────────────────────────────────

export const PaceProfileSchema = z.object({
  timestampsSec: z.array(z.number()),
  wpm: z.array(z.number()),
});
export type PaceProfile = z.infer<typeof PaceProfileSchema>;

// ── Pitch Profile ───────────────────────────────────────────────────────────

export const PitchProfileSchema = z.object({
  timestampsSec: z.array(z.number()),
  hz: z.array(z.number()),
});
export type PitchProfile = z.infer<typeof PitchProfileSchema>;

// ── Expert Clip Detail ──────────────────────────────────────────────────────

export const ExpertClipDetailSchema = z.object({
  id: z.string(),
  techniqueType: TechniqueTypeSchema,
  transcriptText: z.string(),
  audioUrl: z.string().url(),
  durationSec: z.number().positive(),
  waveformJson: z.array(z.number()),
  paceProfileJson: PaceProfileSchema,
  pitchProfileJson: PitchProfileSchema,
});
export type ExpertClipDetail = z.infer<typeof ExpertClipDetailSchema>;
