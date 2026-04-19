import type { FastifyPluginAsync } from 'fastify';
import { PurchaseVerifyRequestSchema } from '@speakcoach/shared';
import { validateBody } from '../middleware/validate';
import { getPurchaseStatus, recordPurchase } from '../services/purchase.service';
import { z } from 'zod';

const PurchaseVerifyBodySchema = z.object({
  platform: z.enum(['ios', 'android']),
  planType: z.enum(['monthly', 'lifetime']),
  receiptToken: z.string(),
});

const purchaseRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /purchase/status — current entitlement (free/active, expiry)
  fastify.get('/purchase/status', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const userId = request.user.userId;
    const status = await getPurchaseStatus(fastify.prisma, userId);
    return reply.send(status);
  });

  // POST /purchase/verify — verify receipt/token for iOS/Android
  // For now, just records the purchase (real receipt verification comes later with RevenueCat)
  fastify.post('/purchase/verify', {
    preHandler: [fastify.authenticate, validateBody(PurchaseVerifyBodySchema)],
  }, async (request, reply) => {
    const userId = request.user.userId;
    const { platform, planType, receiptToken } = request.body as z.infer<typeof PurchaseVerifyBodySchema>;

    // TODO: verify receipt with Apple/Google via RevenueCat before recording
    const purchase = await recordPurchase(fastify.prisma, userId, planType, platform);

    return reply.send({
      status: 'active',
      planType: purchase.type,
      expiresAt: purchase.expiresAt ? purchase.expiresAt.toISOString() : null,
    });
  });
};

export default purchaseRoutes;
