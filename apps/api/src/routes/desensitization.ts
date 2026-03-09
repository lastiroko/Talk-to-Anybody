import type { FastifyPluginAsync } from 'fastify';
import { DesensitizationStatusSchema } from '@speakcoach/shared';

const desensitizationRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /desensitization/status — current level, history, and threshold config
  // preHandler: [fastify.authenticate]
  fastify.get('/desensitization/status', async (request, reply) => {
    // TODO: fetch user's desensitization progress, calculate sessions below threshold, return DesensitizationStatus
    return reply.status(501).send({ message: 'not implemented' });
  });
};

export default desensitizationRoutes;
