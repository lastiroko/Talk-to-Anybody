import type { FastifyPluginAsync } from 'fastify';
import {
  SignupRequestSchema,
  LoginRequestSchema,
  AuthResponseSchema,
} from '@speakcoach/shared';
import { validateBody } from '../middleware/validate';

const authRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /auth/signup — email/password signup
  fastify.post('/auth/signup', {
    preHandler: [validateBody(SignupRequestSchema)],
  }, async (request, reply) => {
    // TODO: hash password, create user, generate tokens, return AuthResponse
    return reply.status(501).send({ message: 'not implemented' });
  });

  // POST /auth/login — email/password login
  fastify.post('/auth/login', {
    preHandler: [validateBody(LoginRequestSchema)],
  }, async (request, reply) => {
    // TODO: verify credentials, generate tokens, return AuthResponse
    return reply.status(501).send({ message: 'not implemented' });
  });

  // POST /auth/refresh — refresh tokens
  fastify.post('/auth/refresh', async (request, reply) => {
    // TODO: verify refresh token, issue new access + refresh tokens
    return reply.status(501).send({ message: 'not implemented' });
  });

  // POST /auth/apple — federated login (optional in MVP)
  fastify.post('/auth/apple', async (request, reply) => {
    // TODO: verify Apple identity token, create/find user, return AuthResponse
    return reply.status(501).send({ message: 'not implemented' });
  });

  // POST /auth/google — federated login (optional in MVP)
  fastify.post('/auth/google', async (request, reply) => {
    // TODO: verify Google ID token, create/find user, return AuthResponse
    return reply.status(501).send({ message: 'not implemented' });
  });
};

export default authRoutes;
