import { z } from 'zod';

// ── Desensitization Level ───────────────────────────────────────────────────

export const DesensitizationLevelSchema = z.object({
  level: z.number().int().min(1).max(6),
  label: z.string(),
  unlockedAt: z.string().datetime().nullable(),
});
export type DesensitizationLevel = z.infer<typeof DesensitizationLevelSchema>;

// ── Desensitization Status ──────────────────────────────────────────────────

export const DesensitizationStatusSchema = z.object({
  currentLevel: z.number().int().min(1).max(6),
  levels: z.array(DesensitizationLevelSchema),
  /** Post-session anxiety must stay below this to advance */
  threshold: z.number().int(),
  sessionsAtCurrentLevel: z.number().int().nonnegative(),
  rollingAvgPostAtLevel: z.number(),
  /** Need 3+ sessions below threshold to unlock next level */
  sessionsBelowThreshold: z.number().int().nonnegative(),
  nextLevelReady: z.boolean(),
});
export type DesensitizationStatus = z.infer<typeof DesensitizationStatusSchema>;
