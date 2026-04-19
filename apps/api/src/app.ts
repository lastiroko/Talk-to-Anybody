import Fastify from 'fastify';
import type { Env } from './config';
import { loggerConfig } from './utils/logger';

// Plugins
import corsPlugin from './plugins/cors';
import authPlugin from './plugins/auth';
import errorHandlerPlugin from './plugins/error-handler';

// Routes
import authRoutes from './routes/auth';
import planRoutes from './routes/plan';
import sessionRoutes from './routes/sessions';
import analysisRoutes from './routes/analysis';
import progressRoutes from './routes/progress';
import srsRoutes from './routes/srs';
import unlearningRoutes from './routes/unlearning';
import desensitizationRoutes from './routes/desensitization';
import anxietyRoutes from './routes/anxiety';
import rewardRoutes from './routes/rewards';
import imitationRoutes from './routes/imitation';
import purchaseRoutes from './routes/purchase';
import feedbackRoutes from './routes/feedback';
import gameScoreRoutes from './routes/game-scores';

declare module 'fastify' {
  interface FastifyInstance {
    config: Env;
  }
}

export async function buildApp(config: Env) {
  const app = Fastify({ logger: loggerConfig });

  // Decorate with config
  app.decorate('config', config);

  // Register plugins
  await app.register(corsPlugin);
  await app.register(authPlugin);
  await app.register(errorHandlerPlugin);

  // Register all routes under /api/v1 prefix
  await app.register(async function v1Routes(v1) {
    await v1.register(authRoutes);
    await v1.register(planRoutes);
    await v1.register(sessionRoutes);
    await v1.register(analysisRoutes);
    await v1.register(progressRoutes);
    await v1.register(srsRoutes);
    await v1.register(unlearningRoutes);
    await v1.register(desensitizationRoutes);
    await v1.register(anxietyRoutes);
    await v1.register(rewardRoutes);
    await v1.register(imitationRoutes);
    await v1.register(purchaseRoutes);
    await v1.register(feedbackRoutes);
    await v1.register(gameScoreRoutes);
  }, { prefix: '/api/v1' });

  // Health check (outside versioned prefix)
  app.get('/health', async () => ({ status: 'ok' }));

  return app;
}
