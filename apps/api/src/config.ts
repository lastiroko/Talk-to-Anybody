import { z } from 'zod';

const EnvSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(8),
  JWT_EXPIRES_IN: z.string().default('7d'),
  BUCKET_NAME: z.string().default('speakcoach-recordings'),
  AWS_REGION: z.string().default('auto'),
  AWS_ACCESS_KEY_ID: z.string().default(''),
  AWS_SECRET_ACCESS_KEY: z.string().default(''),
  AWS_ENDPOINT_URL_S3: z.string().default(''),
  DEEPGRAM_API_KEY: z.string().default(''),
  ANTHROPIC_API_KEY: z.string().default(''),
  REDIS_URL: z.string().default('redis://localhost:6379'),
});

export type Env = z.infer<typeof EnvSchema>;

export function loadConfig(): Env {
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid environment variables:', result.error.flatten().fieldErrors);
    process.exit(1);
  }
  return result.data;
}
