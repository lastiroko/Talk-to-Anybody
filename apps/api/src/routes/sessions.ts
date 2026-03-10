import type { FastifyPluginAsync } from 'fastify';
import { CreateSessionRequestSchema } from '@speakcoach/shared';
import { validateBody } from '../middleware/validate';
import { createSession, getSession, getUploadUrl, submitSession } from '../services/session.service';

const sessionRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /sessions — create session
  fastify.post('/sessions', {
    preHandler: [fastify.authenticate, validateBody(CreateSessionRequestSchema)],
  }, async (request, reply) => {
    const { mode, planDayId } = request.body as { mode: any; planDayId?: string };
    const userId = request.user.userId;

    const session = await createSession(fastify.prisma, userId, mode, planDayId);
    return reply.status(201).send(session);
  });

  // POST /sessions/:id/upload-url — presigned URL for audio upload
  fastify.post<{ Params: { id: string } }>('/sessions/:id/upload-url', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const { id } = request.params;
    const userId = request.user.userId;

    const result = await getUploadUrl(fastify.prisma, id, userId);
    if (!result) {
      return reply.status(404).send({ message: 'Session not found' });
    }

    return reply.send(result);
  });

  // POST /sessions/:id/submit — mark recording ready for analysis
  fastify.post<{ Params: { id: string } }>('/sessions/:id/submit', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const { id } = request.params;
    const userId = request.user.userId;

    const session = await submitSession(fastify.prisma, id, userId, {
      deepgramApiKey: fastify.config.DEEPGRAM_API_KEY,
      openaiApiKey: fastify.config.OPENAI_API_KEY,
      redisUrl: fastify.config.REDIS_URL,
    });

    if (!session) {
      return reply.status(404).send({ message: 'Session not found or not in queued state' });
    }

    return reply.send(session);
  });

  // GET /sessions/:id — session status
  fastify.get<{ Params: { id: string } }>('/sessions/:id', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const { id } = request.params;
    const userId = request.user.userId;

    const session = await getSession(fastify.prisma, id, userId);
    if (!session) {
      return reply.status(404).send({ message: 'Session not found' });
    }

    return reply.send(session);
  });
};

export default sessionRoutes;
