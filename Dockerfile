# Use Bun official image
FROM oven/bun:latest AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --production

# Copy all source code
COPY . .

# Build the Next.js app
RUN bun run build

# Expose the port
EXPOSE 3000

# Start the app in production
CMD ["bun", "run", "start"]
