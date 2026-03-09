import type { FastifyPluginAsync } from 'fastify';
import { CreateSessionRequestSchema, SessionSchema } from '@speakcoach/shared';
import { validateBody } from '../middleware/validate';

const sessionRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /sessions — create session
  // preHandler: [fastify.authenticate]
  fastify.post('/sessions', {
    preHandler: [validateBody(CreateSessionRequestSchema)],
  }, async (request, reply) => {
    // TODO: create session record with mode, optional planDayId, return session
    return reply.status(501).send({ message: 'not implemented' });
  });

  // POST /sessions/:id/upload-url — presigned URL for audio upload
  // preHandler: [fastify.authenticate]
  fastify.post<{ Params: { id: string } }>('/sessions/:id/upload-url', async (request, reply) => {
    // TODO: generate presigned S3 URL for audio upload, return { uploadUrl, audioKey }
    const { id } = request.params;
    return reply.status(501).send({ message: 'not implemented' });
  });

  // POST /sessions/:id/submit — mark recording ready for analysis
  // preHandler: [fastify.authenticate]
  fastify.post<{ Params: { id: string } }>('/sessions/:id/submit', async (request, reply) => {
    // TODO: update session status to 'queued', trigger analysis pipeline
    const { id } = request.params;
    return reply.status(501).send({ message: 'not implemented' });
  });

  // GET /sessions/:id — session status
  // preHandler: [fastify.authenticate]
  fastify.get<{ Params: { id: string } }>('/sessions/:id', async (request, reply) => {
    // TODO: return session with status (queued | processing | done | error)
    const { id } = request.params;
    return reply.status(501).send({ message: 'not implemented' });
  });
};

export default sessionRoutes;
