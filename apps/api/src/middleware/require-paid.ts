import type { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Route-level subscription check.
 * Use as a preHandler after requireAuth to ensure the user has an active subscription.
 */
export async function requirePaid(request: FastifyRequest, reply: FastifyReply) {
  // TODO: implement — query purchases table for active subscription
  // const userId = request.user.userId;
  // const purchase = await request.server.prisma.purchase.findFirst({ where: { userId, status: 'active' } });
  // if (!purchase) throw request.server.httpErrors.paymentRequired('Active subscription required');
}
