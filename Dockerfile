# Use node alpine for smaller image
FROM node:25.2.1-alpine3.23

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy all app files
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Start only the production server
CMD ["npm", "start"]
