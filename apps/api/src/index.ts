import { PrismaClient } from '@prisma/client';
import { loadConfig } from './config';
import { buildApp } from './app';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

async function main() {
  // 1. Load and validate environment config
  const config = loadConfig();

  // 2. Create Prisma client
  const prisma = new PrismaClient();

  // 3. Build Fastify app
  const app = await buildApp(config);

  // 4. Decorate with Prisma client
  app.decorate('prisma', prisma);

  // 5. Graceful shutdown
  const shutdown = async (signal: string) => {
    app.log.info(`Received ${signal}, shutting down...`);
    await app.close();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // 6. Start listening
  try {
    await app.listen({ port: config.PORT, host: '0.0.0.0' });
    app.log.info(`Server running on http://localhost:${config.PORT}`);
  } catch (err) {
    app.log.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
