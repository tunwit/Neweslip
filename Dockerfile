# -----------------------------------------------------------------------------
# This Dockerfile.bun is specifically configured for projects using Bun
# -----------------------------------------------------------------------------

# Use Bun's official image
FROM oven/bun:canary-alpine AS base

WORKDIR /app

# Install dependencies with bun
FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --no-save --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# FORCES SWC TO BE STATICALLY COMPILED, FIXING THE RUNTIME CRASH
ENV NEXT_PRIVATE_STANDALONE_SWC=1

RUN bun run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Install user management tools and create non-root user/group (Alpine method)
RUN apk update && apk add --no-cache shadow && \
    addgroup -g 1001 nodejs && \
    adduser -u 1001 -G nodejs -S nextjs

# Automatically leverage output traces to reduce image size (Next.js Standalone mode)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Use the generated server.js entrypoint
CMD ["bun", "./server.js"]