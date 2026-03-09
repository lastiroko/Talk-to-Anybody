import type { FastifyPluginAsync } from 'fastify';
import { AnalysisResultSchema } from '@speakcoach/shared';

const analysisRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /sessions/:id/analysis — scorecard JSON with metrics, scores, coaching tips, reward
  // preHandler: [fastify.authenticate]
  fastify.get<{ Params: { id: string } }>('/sessions/:id/analysis', async (request, reply) => {
    // TODO: fetch analysis result for session, validate with AnalysisResultSchema, return scorecard
    const { id } = request.params;
    return reply.status(501).send({ message: 'not implemented' });
  });
};

export default analysisRoutes;
