import type { FastifyRequest, FastifyReply } from 'fastify';
import type { ZodSchema } from 'zod';

/**
 * Create a preHandler that validates the request body against a Zod schema.
 * Throws a 400 with structured validation errors on failure.
 */
export function validateBody(schema: ZodSchema) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const result = schema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Validation Error',
        message: 'Request body validation failed',
        details: result.error.flatten().fieldErrors,
      });
    }
    // Replace body with parsed/validated data (applies defaults, transforms, etc.)
    request.body = result.data;
  };
}

/**
 * Create a preHandler that validates request query params against a Zod schema.
 */
export function validateQuery(schema: ZodSchema) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const result = schema.safeParse(request.query);
    if (!result.success) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Validation Error',
        message: 'Query parameter validation failed',
        details: result.error.flatten().fieldErrors,
      });
    }
    request.query = result.data;
  };
}

/**
 * Create a preHandler that validates request params against a Zod schema.
 */
export function validateParams(schema: ZodSchema) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const result = schema.safeParse(request.params);
    if (!result.success) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Validation Error',
        message: 'Path parameter validation failed',
        details: result.error.flatten().fieldErrors,
      });
    }
    request.params = result.data;
  };
}
