import type { FastifyPluginAsync } from 'fastify';
import {
  SrsDueResponseSchema,
  SrsReviewRequestSchema,
  SrsReviewResponseSchema,
  SrsStatsSchema,
} from '@speakcoach/shared';
import { validateBody } from '../middleware/validate';

const srsRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /srs/due — returns drills due for review today
  // preHandler: [fastify.authenticate]
  fastify.get('/srs/due', async (request, reply) => {
    // TODO: query SRS cards where nextReviewDate <= today, order by priority, return SrsDueResponse
    return reply.status(501).send({ message: 'not implemented' });
  });

  // POST /srs/review — submit review result, update scheduling
  // preHandler: [fastify.authenticate]
  fastify.post('/srs/review', {
    preHandler: [validateBody(SrsReviewRequestSchema)],
  }, async (request, reply) => {
    // TODO: update card interval based on score vs previous, apply snooze/skip rules, return SrsReviewResponse
    return reply.status(501).send({ message: 'not implemented' });
  });

  // GET /srs/stats — user's SRS overview for progress dashboard
  // preHandler: [fastify.authenticate]
  fastify.get('/srs/stats', async (request, reply) => {
    // TODO: aggregate SRS card counts by dimension, reviews this week, return SrsStats
    return reply.status(501).send({ message: 'not implemented' });
  });
};

export default srsRoutes;
