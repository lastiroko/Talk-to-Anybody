import type { FastifyPluginAsync } from 'fastify';
import {
  SignupRequestSchema,
  LoginRequestSchema,
  RefreshRequestSchema,
  LogoutRequestSchema,
} from '@speakcoach/shared';
import type {
  SignupRequest,
  LoginRequest,
  RefreshRequest,
  LogoutRequest,
} from '@speakcoach/shared';
import { validateBody } from '../middleware/validate';
import {
  hashPassword,
  verifyPassword,
  createUser,
  findUserByEmail,
  generateTokens,
  rotateRefreshToken,
  revokeRefreshToken,
} from '../services/auth.service';

const authRoutes: FastifyPluginAsync = async (fastify) => {
  const refreshTtlDays = fastify.config.REFRESH_TOKEN_TTL_DAYS;

  fastify.post('/auth/signup', {
    preHandler: [validateBody(SignupRequestSchema)],
  }, async (request, reply) => {
    const { email, password } = request.body as SignupRequest;

    const passwordHash = await hashPassword(password);
    const user = await createUser(fastify.prisma, email, passwordHash);
    const { accessToken, refreshToken } = await generateTokens(
      fastify.prisma,
      user.id,
      (payload: { sub: string }) => fastify.jwt.sign(payload),
      refreshTtlDays,
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

    const { accessToken, refreshToken } = await generateTokens(
      fastify.prisma,
      user.id,
      (payload: { sub: string }) => fastify.jwt.sign(payload),
      refreshTtlDays,
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

  fastify.post('/auth/refresh', {
    preHandler: [validateBody(RefreshRequestSchema)],
  }, async (request, reply) => {
    const { refreshToken } = request.body as RefreshRequest;

    const result = await rotateRefreshToken(
      fastify.prisma,
      refreshToken,
      (payload: { sub: string }) => fastify.jwt.sign(payload),
      refreshTtlDays,
    );

    if (!result) {
      return reply.status(401).send({ message: 'Invalid or expired refresh token' });
    }

    return reply.status(200).send(result);
  });

  fastify.post('/auth/logout', {
    preHandler: [validateBody(LogoutRequestSchema)],
  }, async (request, reply) => {
    const { refreshToken } = request.body as LogoutRequest;
    await revokeRefreshToken(fastify.prisma, refreshToken);
    return reply.status(204).send();
  });

  fastify.post('/auth/apple', async (_request, reply) => {
    return reply.status(501).send({ message: 'not implemented' });
  });

  fastify.post('/auth/google', async (_request, reply) => {
    return reply.status(501).send({ message: 'not implemented' });
  });
};

export default authRoutes;
