# Use Bun official image
FROM oven/bun:canary-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile 

# Copy all source code
COPY . .

# Build the Next.js app
RUN bun run build

# Expose the port
EXPOSE 3000

# Start the app in production
CMD ["bun", "run", "start"]
