import type { FastifyPluginAsync } from 'fastify';
import { RewardEngagementRequestSchema } from '@speakcoach/shared';
import { validateBody } from '../middleware/validate';

const rewardRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /rewards/engagement — log user interaction with reward format
  // preHandler: [fastify.authenticate]
  fastify.post('/rewards/engagement', {
    preHandler: [validateBody(RewardEngagementRequestSchema)],
  }, async (request, reply) => {
    // TODO: record engagement action, update per-user reward weights, return { recorded: true }
    return reply.status(501).send({ message: 'not implemented' });
  });
};

export default rewardRoutes;
