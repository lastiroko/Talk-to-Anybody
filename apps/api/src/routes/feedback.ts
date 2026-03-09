import type { FastifyPluginAsync } from 'fastify';

const feedbackRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /feedback/report — report bad coaching/transcript issues
  // preHandler: [fastify.authenticate]
  fastify.post('/feedback/report', async (request, reply) => {
    // TODO: store feedback report with session reference, notify team
    return reply.status(501).send({ message: 'not implemented' });
  });
};

export default feedbackRoutes;
