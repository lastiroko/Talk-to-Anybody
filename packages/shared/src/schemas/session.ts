import { z } from 'zod';
import { SessionModeSchema, SessionStatusSchema } from '../enums';

// ── Create Session Request ──────────────────────────────────────────────────

export const CreateSessionRequestSchema = z.object({
  mode: SessionModeSchema,
  planDayId: z.string().optional(),
});
export type CreateSessionRequest = z.infer<typeof CreateSessionRequestSchema>;

// ── Session ─────────────────────────────────────────────────────────────────

export const SessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  planDayId: z.string().optional(),
  mode: SessionModeSchema,
  status: SessionStatusSchema,
  createdAt: z.string().datetime(),
  durationSec: z.number().int().nonnegative().optional(),
});
export type Session = z.infer<typeof SessionSchema>;

// ── Recording ───────────────────────────────────────────────────────────────

export const RecordingSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  audioUrl: z.string().url(),
  audioDurationSec: z.number().nonnegative(),
  audioFormat: z.string(),
  createdAt: z.string().datetime(),
});
export type Recording = z.infer<typeof RecordingSchema>;
