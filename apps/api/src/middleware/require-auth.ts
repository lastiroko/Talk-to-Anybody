import type { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Route-level auth guard.
 * Use as a preHandler to require a valid JWT on a route.
 */
export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  await request.server.authenticate(request);
}
