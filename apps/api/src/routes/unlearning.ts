import type { FastifyPluginAsync } from 'fastify';
import {
  UnlearningStatusResponseSchema,
  DetectTapRequestSchema,
  DetectTapResponseSchema,
  PhaseCompleteRequestSchema,
  PhaseCompleteResponseSchema,
} from '@speakcoach/shared';
import { validateBody } from '../middleware/validate';
import { getUnlearningStatus, updateProgress, compareDetectTaps, completePhase } from '../services/unlearning.service';
import { z } from 'zod';

const UpdateProgressBodySchema = z.object({
  habitType: z.enum(['filler', 'uptalk', 'rushing']),
  detectionAccuracy: z.number().min(0).max(1),
  isClean: z.boolean(),
});

const unlearningRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /unlearning/status — current habits being tracked, phase, and progress
  fastify.get('/unlearning/status', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const userId = request.user.userId;
    const status = await getUnlearningStatus(fastify.prisma, userId);
    return reply.send(status);
  });

  // POST /unlearning/update — update progress for a habit after a session
  fastify.post('/unlearning/update', {
    preHandler: [fastify.authenticate, validateBody(UpdateProgressBodySchema)],
  }, async (request, reply) => {
    const userId = request.user.userId;
    const { habitType, detectionAccuracy, isClean } = request.body as z.infer<typeof UpdateProgressBodySchema>;
    const result = await updateProgress(fastify.prisma, userId, habitType, detectionAccuracy, isClean);
    return reply.send(result);
  });

  // POST /unlearning/detect-tap — submit user-tapped filler markers for accuracy comparison
  fastify.post('/unlearning/detect-tap', {
    preHandler: [fastify.authenticate, validateBody(DetectTapRequestSchema)],
  }, async (request, reply) => {
    // TODO: compare user taps against AI-detected markers (±0.5s tolerance), calculate accuracy, return DetectTapResponse
    return reply.status(501).send({ message: 'not implemented' });
  });

  // POST /unlearning/phase-complete — mark phase as passed, advance to next
  fastify.post('/unlearning/phase-complete', {
    preHandler: [fastify.authenticate, validateBody(PhaseCompleteRequestSchema)],
  }, async (request, reply) => {
    // TODO: validate phase gate threshold met, advance to next phase, return PhaseCompleteResponse
    return reply.status(501).send({ message: 'not implemented' });
  });
};

export default unlearningRoutes;
