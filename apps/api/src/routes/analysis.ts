import type { FastifyPluginAsync } from 'fastify';
import { getAnalysis } from '../services/analysis.service';

const analysisRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /sessions/:id/analysis — scorecard JSON with metrics, scores, coaching tips, reward
  fastify.get<{ Params: { id: string } }>('/sessions/:id/analysis', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const { id } = request.params;
    const userId = request.user.userId;

    const analysis = await getAnalysis(fastify.prisma, id, userId);
    if (!analysis) {
      return reply.status(404).send({ message: 'Analysis not found' });
    }

    return reply.send(analysis);
  });
};

export default analysisRoutes;
