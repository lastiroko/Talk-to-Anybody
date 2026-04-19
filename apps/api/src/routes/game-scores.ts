import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';

const GameScoreBodySchema = z.object({
  gameName: z.string().min(1),
  score: z.number().int().min(0),
  maxScore: z.number().int().min(1),
});

const gameScoreRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /game-scores — record a game score
  fastify.post('/game-scores', {
    preHandler: [fastify.authenticate, validateBody(GameScoreBodySchema)],
  }, async (request, reply) => {
    const userId = request.user.userId;
    const { gameName, score, maxScore } = request.body as z.infer<typeof GameScoreBodySchema>;

    await fastify.prisma.eventAnalytics.create({
      data: {
        userId,
        eventName: 'game_score',
        propertiesJson: { gameName, score, maxScore },
      },
    });

    return reply.send({ recorded: true });
  });
};

export default gameScoreRoutes;
