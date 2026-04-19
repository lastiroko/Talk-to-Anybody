import type { FastifyPluginAsync } from 'fastify';
import { getDesensitizationStatus, advanceLevel } from '../services/desensitization.service';

const desensitizationRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /desensitization/status — current level, history, and threshold config
  fastify.get('/desensitization/status', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const userId = request.user.userId;
    const status = await getDesensitizationStatus(fastify.prisma, userId);
    return reply.send(status);
  });

  // POST /desensitization/advance — advance to next level
  fastify.post('/desensitization/advance', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const userId = request.user.userId;
    const result = await advanceLevel(fastify.prisma, userId);
    return reply.send(result);
  });
};

export default desensitizationRoutes;
