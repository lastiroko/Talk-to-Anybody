import type { FastifyPluginAsync } from 'fastify';
import {
  SrsReviewRequestSchema,
} from '@speakcoach/shared';
import { validateBody } from '../middleware/validate';
import {
  getSrsDueCards,
  processReview,
  getSrsStats,
} from '../services/srs.service';

const srsRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /srs/due — returns drills due for review today
  fastify.get('/srs/due', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const userId = request.user.userId;
    const result = await getSrsDueCards(fastify.prisma, userId);
    return reply.send(result);
  });

  // POST /srs/review — submit review result, update scheduling
  fastify.post('/srs/review', {
    preHandler: [fastify.authenticate, validateBody(SrsReviewRequestSchema)],
  }, async (request, reply) => {
    const userId = request.user.userId;
    const { cardId, sessionId, score, action } = request.body as {
      cardId: string;
      sessionId: string;
      score: number;
      action: 'completed' | 'snoozed' | 'skipped';
    };

    try {
      const result = await processReview(fastify.prisma, userId, cardId, sessionId, score, action);
      return reply.send(result);
    } catch (err: any) {
      if (err.message === 'Card not found') {
        return reply.status(404).send({ message: 'Card not found' });
      }
      throw err;
    }
  });

  // GET /srs/stats — user's SRS overview for progress dashboard
  fastify.get('/srs/stats', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const userId = request.user.userId;
    const stats = await getSrsStats(fastify.prisma, userId);
    return reply.send(stats);
  });
};

export default srsRoutes;
