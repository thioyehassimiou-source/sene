# ==============================================================================
# SÈNÈ BACKEND - MULTI-STAGE PRODUCTION DOCKERFILE
# ==============================================================================

# Stage 1: Base Alpine Image
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl dumb-init
WORKDIR /app

# Stage 2: Dependencies
FROM base AS dependencies
WORKDIR /app
COPY package.json ./
# Install all dependencies including devDependencies for build
RUN npm install
COPY prisma ./prisma
# Generate Prisma Client
RUN npx prisma generate

# Stage 3: Builder
FROM base AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build
# Prune dev dependencies for lean production container
RUN npm prune --production

# Stage 4: Production Runner
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Security: run as unprivileged node user
USER node

# Copy generated Prisma artifacts and built files
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/prisma ./prisma
COPY --chown=node:node package.json ./

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/v1/health || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/main"]

