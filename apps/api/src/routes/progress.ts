import type { FastifyPluginAsync } from 'fastify';
import { getProgressSummary, getAnxietyTrend } from '../services/progress.service';

const progressRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /progress/summary — streak, totals, avg score, days completed
  fastify.get('/progress/summary', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const userId = request.user.userId;
    const summary = await getProgressSummary(fastify.prisma, userId);
    return reply.send(summary);
  });

  // GET /progress/anxiety — anxiety trend data for the progress dashboard
  fastify.get('/progress/anxiety', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const userId = request.user.userId;
    const trend = await getAnxietyTrend(fastify.prisma, userId);
    return reply.send(trend);
  });
};

export default progressRoutes;
