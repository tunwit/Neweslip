# Use Bun official image
FROM jarredsumner/bun:latest AS deps
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --production

# Copy source code
FROM oven/bun:latest AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Build Next.js app
RUN bun run build

# Production runner
FROM oven/bun:latest AS runner
WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder /app ./

EXPOSE 3000

CMD ["bun", "run", "start"]
