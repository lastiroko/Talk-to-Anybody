import type { FastifyPluginAsync } from 'fastify';
import {
  SignupRequestSchema,
  LoginRequestSchema,
} from '@speakcoach/shared';
import type { SignupRequest, LoginRequest } from '@speakcoach/shared';
import { validateBody } from '../middleware/validate';
import {
  hashPassword,
  verifyPassword,
  createUser,
  findUserByEmail,
  generateTokens,
} from '../services/auth.service';

const authRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /auth/signup — email/password signup
  fastify.post('/auth/signup', {
    preHandler: [validateBody(SignupRequestSchema)],
  }, async (request, reply) => {
    const { email, password } = request.body as SignupRequest;

    const passwordHash = await hashPassword(password);
    const user = await createUser(fastify.prisma, email, passwordHash);
    const { accessToken, refreshToken } = generateTokens(
      user.id,
      (payload: { sub: string }) => fastify.jwt.sign(payload),
    );

    return reply.status(201).send({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        goal: user.goal ?? undefined,
        dailyMinutesTarget: user.dailyMinutesTarget ?? undefined,
        timezone: user.timezone ?? undefined,
      },
    });
  });

  // POST /auth/login — email/password login
  fastify.post('/auth/login', {
    preHandler: [validateBody(LoginRequestSchema)],
  }, async (request, reply) => {
    const { email, password } = request.body as LoginRequest;

    const user = await findUserByEmail(fastify.prisma, email);
    if (!user) {
      return reply.status(401).send({ message: 'Invalid email or password' });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return reply.status(401).send({ message: 'Invalid email or password' });
    }

    const { accessToken, refreshToken } = generateTokens(
      user.id,
      (payload: { sub: string }) => fastify.jwt.sign(payload),
    );

    return reply.status(200).send({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        goal: user.goal ?? undefined,
        dailyMinutesTarget: user.dailyMinutesTarget ?? undefined,
        timezone: user.timezone ?? undefined,
      },
    });
  });

  // POST /auth/refresh — refresh tokens
  fastify.post('/auth/refresh', async (_request, reply) => {
    // TODO: verify refresh token, issue new access + refresh tokens
    return reply.status(501).send({ message: 'not implemented' });
  });

  // POST /auth/apple — federated login (optional in MVP)
  fastify.post('/auth/apple', async (_request, reply) => {
    // TODO: verify Apple identity token, create/find user, return AuthResponse
    return reply.status(501).send({ message: 'not implemented' });
  });

  // POST /auth/google — federated login (optional in MVP)
  fastify.post('/auth/google', async (_request, reply) => {
    // TODO: verify Google ID token, create/find user, return AuthResponse
    return reply.status(501).send({ message: 'not implemented' });
  });
};

export default authRoutes;
