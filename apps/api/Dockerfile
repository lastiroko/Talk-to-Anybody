# ---- Stage 1: Build ----
FROM node:20-alpine AS build

WORKDIR /app

# Copy root workspace config
COPY package.json package-lock.json ./

# Copy shared package (local dependency)
COPY packages/shared/package.json packages/shared/
COPY packages/shared/tsconfig.json packages/shared/
COPY packages/shared/src/ packages/shared/src/

# Copy API package
COPY apps/api/package.json apps/api/
COPY apps/api/tsconfig.json apps/api/
COPY apps/api/prisma/ apps/api/prisma/
COPY apps/api/src/ apps/api/src/

# Copy base tsconfig (referenced by both packages)
COPY tsconfig.base.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci --workspace=@speakcoach/shared --workspace=@speakcoach/api --include-workspace-root

# Build shared package first (API depends on it)
RUN npm run build --workspace=@speakcoach/shared

# Generate Prisma client
RUN npx prisma generate --schema=apps/api/prisma/schema.prisma

# Build API
RUN npm run build --workspace=@speakcoach/api

# ---- Stage 2: Production ----
FROM node:20-alpine AS production

WORKDIR /app

# Copy root workspace config
COPY package.json package-lock.json ./

# Copy shared package.json (needed for workspace resolution)
COPY packages/shared/package.json packages/shared/

# Copy API package.json
COPY apps/api/package.json apps/api/

# Install production dependencies only
RUN npm ci --workspace=@speakcoach/shared --workspace=@speakcoach/api --include-workspace-root --omit=dev

# Copy built shared package
COPY --from=build /app/packages/shared/dist/ packages/shared/dist/

# Copy built API
COPY --from=build /app/apps/api/dist/ apps/api/dist/

# Copy Prisma schema and generated client (generated at root node_modules)
COPY --from=build /app/apps/api/prisma/ apps/api/prisma/
COPY --from=build /app/node_modules/.prisma/ node_modules/.prisma/
COPY --from=build /app/node_modules/@prisma/client/ node_modules/@prisma/client/

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

WORKDIR /app/apps/api

CMD ["node", "dist/index.js"]
