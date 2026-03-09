import { z } from 'zod';

// ── User ────────────────────────────────────────────────────────────────────

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
  goal: z.string().optional(),
  dailyMinutesTarget: z.number().int().positive().optional(),
  timezone: z.string().optional(),
});
export type User = z.infer<typeof UserSchema>;

// ── Signup Request ──────────────────────────────────────────────────────────

export const SignupRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type SignupRequest = z.infer<typeof SignupRequestSchema>;

// ── Login Request ───────────────────────────────────────────────────────────

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

// ── Auth Response ───────────────────────────────────────────────────────────

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: UserSchema,
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
