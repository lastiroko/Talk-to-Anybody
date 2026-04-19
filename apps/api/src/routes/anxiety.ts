import type { FastifyPluginAsync } from 'fastify';
import { AnxietyRatingRequestSchema } from '@speakcoach/shared';
import { validateBody } from '../middleware/validate';
import { recordAnxietyRating } from '../services/anxiety.service';

const anxietyRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /sessions/:id/anxiety — submit pre or post session anxiety rating
  fastify.post<{ Params: { id: string } }>('/sessions/:id/anxiety', {
    preHandler: [fastify.authenticate, validateBody(AnxietyRatingRequestSchema)],
  }, async (request, reply) => {
    const { id: sessionId } = request.params;
    const userId = request.user.userId;
    const { timing, rating } = request.body as { timing: 'pre' | 'post'; rating: number };

    const result = await recordAnxietyRating(fastify.prisma, userId, sessionId, timing, rating);
    return reply.send(result);
  });
};

export default anxietyRoutes;
