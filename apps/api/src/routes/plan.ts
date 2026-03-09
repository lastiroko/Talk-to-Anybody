import type { FastifyPluginAsync } from 'fastify';
import { PlanDaySchema } from '@speakcoach/shared';

const planRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /plan — list days with lock/completion status
  // preHandler: [fastify.authenticate]
  fastify.get('/plan', async (request, reply) => {
    // TODO: fetch all 60 days with user's completion status and lock state
    return reply.status(501).send({ message: 'not implemented' });
  });

  // GET /plan/day/:dayNumber — full day detail JSON
  // preHandler: [fastify.authenticate]
  fastify.get<{ Params: { dayNumber: string } }>('/plan/day/:dayNumber', async (request, reply) => {
    // TODO: fetch day content, validate with PlanDaySchema, return full day detail
    const { dayNumber } = request.params;
    return reply.status(501).send({ message: 'not implemented' });
  });

  // POST /plan/day/:dayNumber/complete — mark completion
  // preHandler: [fastify.authenticate]
  fastify.post<{ Params: { dayNumber: string } }>('/plan/day/:dayNumber/complete', async (request, reply) => {
    // TODO: mark day complete, update streak, unlock next day, create SRS cards
    const { dayNumber } = request.params;
    return reply.status(501).send({ message: 'not implemented' });
  });
};

export default planRoutes;
