# Use node alpine for smaller image
FROM oven/bun:canary-debian

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package.json bun.lockb* ./
RUN bun install
# Copy all app files
COPY . .


# Expose port
EXPOSE 3000

# Start only the production server
CMD ["bun", "run", "dev"]
