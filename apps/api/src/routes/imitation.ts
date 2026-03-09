import type { FastifyPluginAsync } from 'fastify';
import {
  ExpertClipDetailSchema,
  ImitationCompareRequestSchema,
  ImitationCompareResponseSchema,
} from '@speakcoach/shared';
import { validateBody } from '../middleware/validate';

const imitationRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /expert-clips/:id — retrieve expert clip metadata, audio URL, and analysis profiles
  // preHandler: [fastify.authenticate]
  fastify.get<{ Params: { id: string } }>('/expert-clips/:id', async (request, reply) => {
    // TODO: fetch expert clip by id, return ExpertClipDetail
    const { id } = request.params;
    return reply.status(501).send({ message: 'not implemented' });
  });

  // POST /imitation/compare — submit user recording for comparison against expert clip
  // preHandler: [fastify.authenticate]
  fastify.post('/imitation/compare', {
    preHandler: [validateBody(ImitationCompareRequestSchema)],
  }, async (request, reply) => {
    // TODO: compare user recording against expert clip on specified dimensions, return ImitationCompareResponse
    return reply.status(501).send({ message: 'not implemented' });
  });
};

export default imitationRoutes;
