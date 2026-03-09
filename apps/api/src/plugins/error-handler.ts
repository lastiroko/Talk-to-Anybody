import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyError } from 'fastify';
import { ZodError } from 'zod';

export default fp(async function errorHandlerPlugin(fastify: FastifyInstance) {
  fastify.setErrorHandler(function (error: FastifyError | ZodError, request, reply) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Validation Error',
        message: 'Request validation failed',
        details: error.flatten().fieldErrors,
      });
    }

    // Handle Fastify errors with status codes
    const statusCode = (error as FastifyError).statusCode ?? 500;

    if (statusCode >= 500) {
      request.log.error(error);
    }

    return reply.status(statusCode).send({
      statusCode,
      error: error.name,
      message: error.message,
    });
  });
});
