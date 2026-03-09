import type { FastifyPluginAsync } from 'fastify';
import { PurchaseVerifyRequestSchema, PurchaseStatusSchema } from '@speakcoach/shared';
import { validateBody } from '../middleware/validate';

const purchaseRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /purchase/verify — verify receipt/token for iOS/Android
  // preHandler: [fastify.authenticate]
  fastify.post('/purchase/verify', {
    preHandler: [validateBody(PurchaseVerifyRequestSchema)],
  }, async (request, reply) => {
    // TODO: verify receipt with Apple/Google, create or update purchase record, return entitlement
    return reply.status(501).send({ message: 'not implemented' });
  });

  // GET /purchase/status — current entitlement (free/paid, expiry)
  // preHandler: [fastify.authenticate]
  fastify.get('/purchase/status', async (request, reply) => {
    // TODO: query user's active purchase, return PurchaseStatus
    return reply.status(501).send({ message: 'not implemented' });
  });
};

export default purchaseRoutes;
