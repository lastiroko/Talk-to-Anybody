import type { FastifyPluginAsync } from 'fastify';
import { AnxietyRatingRequestSchema, AnxietyRatingResponseSchema } from '@speakcoach/shared';
import { validateBody } from '../middleware/validate';

const anxietyRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /sessions/:id/anxiety — submit pre or post session anxiety rating
  // preHandler: [fastify.authenticate]
  fastify.post<{ Params: { id: string } }>('/sessions/:id/anxiety', {
    preHandler: [validateBody(AnxietyRatingRequestSchema)],
  }, async (request, reply) => {
    // TODO: store rating, compute rolling average, detect spikes, return AnxietyRatingResponse
    const { id } = request.params;
    return reply.status(501).send({ message: 'not implemented' });
  });
};

export default anxietyRoutes;
