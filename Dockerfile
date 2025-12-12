FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY . .

RUN bun run next build

EXPOSE 3000
CMD ["bun", "run", "next", "start", "-H", "0.0.0.0", "-p", "3000"]
