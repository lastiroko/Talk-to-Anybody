import type { FastifyPluginAsync } from 'fastify';
import { validateBody } from '../middleware/validate';
import {
  getPurchaseStatus,
  recordPurchase,
  verifyWithRevenueCat,
} from '../services/purchase.service';
import { z } from 'zod';

const PurchaseVerifyBodySchema = z.object({
  platform: z.enum(['ios', 'android']),
  planType: z.enum(['monthly', 'lifetime']),
  receiptToken: z.string().optional(),
});

const purchaseRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/purchase/status', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const userId = request.user.userId;
    const status = await getPurchaseStatus(fastify.prisma, userId);
    return reply.send(status);
  });

  fastify.post('/purchase/verify', {
    preHandler: [fastify.authenticate, validateBody(PurchaseVerifyBodySchema)],
  }, async (request, reply) => {
    const userId = request.user.userId;
    const { platform, planType } = request.body as z.infer<typeof PurchaseVerifyBodySchema>;

    const apiKey = fastify.config.REVENUECAT_SECRET_API_KEY;
    const allowUnverified = fastify.config.ALLOW_UNVERIFIED_PURCHASES;
    const isProd = fastify.config.NODE_ENV === 'production';

    let storeTransactionId: string | null = null;
    let expiresAt: Date | null = null;

    if (apiKey) {
      const result = await verifyWithRevenueCat(apiKey, userId, planType);
      if (!result.valid) {
        return reply.status(402).send({
          message: 'No active entitlement found for this user on RevenueCat',
        });
      }
      storeTransactionId = result.storeTransactionId;
      expiresAt = result.expiresAt;
    } else if (!allowUnverified || isProd) {
      // Fail closed: no verifier configured and not explicitly allowed in dev
      request.log.warn(
        { userId },
        'POST /purchase/verify rejected: REVENUECAT_SECRET_API_KEY not configured',
      );
      return reply.status(503).send({
        message: 'Purchase verification not configured',
      });
    } else {
      request.log.warn(
        { userId, planType, platform },
        'Recording UNVERIFIED purchase — ALLOW_UNVERIFIED_PURCHASES is set, do not use in production',
      );
    }

    const purchase = await recordPurchase(
      fastify.prisma,
      userId,
      planType,
      platform,
      storeTransactionId,
      expiresAt,
    );

    return reply.send({
      status: 'active',
      planType: purchase.type,
      expiresAt: purchase.expiresAt ? purchase.expiresAt.toISOString() : null,
    });
  });
};

export default purchaseRoutes;
