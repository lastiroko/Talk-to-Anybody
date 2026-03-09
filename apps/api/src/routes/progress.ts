import type { FastifyPluginAsync } from 'fastify';
import { ProgressSummarySchema, AnxietyTrendSchema } from '@speakcoach/shared';

const progressRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /progress/summary — streak, totals, trend metrics, anxiety and SRS summaries
  // preHandler: [fastify.authenticate]
  fastify.get('/progress/summary', async (request, reply) => {
    // TODO: aggregate user stats, calculate trends, return ProgressSummary
    return reply.status(501).send({ message: 'not implemented' });
  });

  // GET /progress/anxiety — anxiety trend data for the progress dashboard
  // preHandler: [fastify.authenticate]
  fastify.get('/progress/anxiety', async (request, reply) => {
    // TODO: fetch anxiety ratings, compute rolling averages, detect milestones, return AnxietyTrend
    return reply.status(501).send({ message: 'not implemented' });
  });
};

export default progressRoutes;
