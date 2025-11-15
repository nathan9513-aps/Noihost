# Dockerfile for NestJS API (apps/api)
FROM node:18-alpine AS builder

WORKDIR /app

# install dependencies
COPY package.json package-lock.json ./
# copy root package.json and lock for installing workspace tools
COPY apps/api/package.json apps/api/package.json
COPY apps/api/package-lock.json apps/api/package-lock.json 2>/dev/null || true

RUN apk add --no-cache python3 make g++ \
  && npm ci --ignore-scripts --no-audit --no-fund

# copy source
COPY . .

# install api deps and generate prisma client
WORKDIR /app/apps/api
RUN npm install --production=false --no-audit --no-fund
RUN npx prisma generate

# build
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Install build tools and root deps for caching
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Copy repo and install api-specific deps
COPY . .
WORKDIR /usr/src/app/apps/api
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

# Generate Prisma client (if needed) and build
RUN npx prisma generate || true
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Copy built artifacts and production deps
COPY --from=builder /usr/src/app/apps/api/dist ./dist
COPY --from=builder /usr/src/app/apps/api/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/api/prisma ./prisma
COPY --from=builder /usr/src/app/apps/api/package.json ./package.json

EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD wget -qO- http://localhost:3001/api/health || exit 1

CMD ["node", "dist/main.js"]
