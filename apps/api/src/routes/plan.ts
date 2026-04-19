import type { FastifyPluginAsync } from 'fastify';
import { requireAuth } from '../middleware/require-auth';
import {
  getPlanOverview,
  getPlanDay,
  completeDay,
} from '../services/plan.service';

const planRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /plan — list days with lock/completion status
  fastify.get('/plan', {
    preHandler: [requireAuth],
  }, async (request, reply) => {
    const { userId } = request.user;
    const overview = await getPlanOverview(fastify.prisma, userId);
    return reply.send(overview);
  });

  // GET /plan/day/:dayNumber — full day detail JSON
  fastify.get<{ Params: { dayNumber: string } }>('/plan/day/:dayNumber', {
    preHandler: [requireAuth],
  }, async (request, reply) => {
    const dayNumber = parseInt(request.params.dayNumber, 10);

    if (isNaN(dayNumber) || dayNumber < 1) {
      return reply.status(400).send({ error: 'Invalid day number' });
    }

    const day = await getPlanDay(fastify.prisma, dayNumber);

    if (!day) {
      return reply.status(404).send({ error: 'Day not found' });
    }

    return reply.send(day);
  });

  // POST /plan/day/:dayNumber/complete — mark completion
  fastify.post<{ Params: { dayNumber: string } }>('/plan/day/:dayNumber/complete', {
    preHandler: [requireAuth],
  }, async (request, reply) => {
    const { userId } = request.user;
    const dayNumber = parseInt(request.params.dayNumber, 10);

    if (isNaN(dayNumber) || dayNumber < 1) {
      return reply.status(400).send({ error: 'Invalid day number' });
    }

    const result = await completeDay(fastify.prisma, userId, dayNumber);

    if (!result.success) {
      return reply.status(400).send({ error: result.error });
    }

    return reply.send(result);
  });
};

export default planRoutes;
