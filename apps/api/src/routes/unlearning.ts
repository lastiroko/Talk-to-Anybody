import type { FastifyPluginAsync } from 'fastify';
import {
  UnlearningStatusResponseSchema,
  DetectTapRequestSchema,
  DetectTapResponseSchema,
  PhaseCompleteRequestSchema,
  PhaseCompleteResponseSchema,
} from '@speakcoach/shared';
import { validateBody } from '../middleware/validate';

const unlearningRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /unlearning/status — current habits being tracked, phase, and progress
  // preHandler: [fastify.authenticate]
  fastify.get('/unlearning/status', async (request, reply) => {
    // TODO: fetch user's unlearning progress for all habits, return UnlearningStatusResponse
    return reply.status(501).send({ message: 'not implemented' });
  });

  // POST /unlearning/detect-tap — submit user-tapped filler markers for accuracy comparison
  // preHandler: [fastify.authenticate]
  fastify.post('/unlearning/detect-tap', {
    preHandler: [validateBody(DetectTapRequestSchema)],
  }, async (request, reply) => {
    // TODO: compare user taps against AI-detected markers (±0.5s tolerance), calculate accuracy, return DetectTapResponse
    return reply.status(501).send({ message: 'not implemented' });
  });

  // POST /unlearning/phase-complete — mark phase as passed, advance to next
  // preHandler: [fastify.authenticate]
  fastify.post('/unlearning/phase-complete', {
    preHandler: [validateBody(PhaseCompleteRequestSchema)],
  }, async (request, reply) => {
    // TODO: validate phase gate threshold met, advance to next phase, return PhaseCompleteResponse
    return reply.status(501).send({ message: 'not implemented' });
  });
};

export default unlearningRoutes;
