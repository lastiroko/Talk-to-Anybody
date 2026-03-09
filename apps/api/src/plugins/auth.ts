import fp from 'fastify-plugin';
import fjwt from '@fastify/jwt';
import type { FastifyInstance, FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest) => Promise<void>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: string };
    user: { userId: string };
  }
}

export default fp(async function authPlugin(fastify: FastifyInstance) {
  await fastify.register(fjwt, {
    secret: fastify.config.JWT_SECRET,
    sign: { expiresIn: fastify.config.JWT_EXPIRES_IN },
  });

  fastify.decorate('authenticate', async function (request: FastifyRequest) {
    // TODO: implement full JWT verification
    // For now, stub: extract userId from JWT payload
    try {
      await request.jwtVerify();
    } catch (err) {
      const error = new Error('Invalid or expired token');
      (error as any).statusCode = 401;
      throw error;
    }
  });
});
