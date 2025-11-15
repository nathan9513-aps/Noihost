FROM node:18-alpine AS builder
WORKDIR /app

# Install build tools
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json package-lock.json* ./
COPY apps/api/package.json apps/api/

# Install root dependencies
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

# Copy all source code
COPY . .

# Install API dependencies and generate Prisma client
WORKDIR /app/apps/api
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built artifacts
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/package.json ./package.json

EXPOSE 3001

# Healthcheck
RUN apk add --no-cache wget
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

CMD ["node", "dist/main.js"]
