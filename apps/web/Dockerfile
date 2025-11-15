FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY apps/web/package.json apps/web/

# Install root dependencies
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

# Copy all source code
COPY . .

# Install web dependencies
WORKDIR /app/apps/web
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

# Build Next.js app
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built artifacts
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/node_modules ./node_modules
COPY --from=builder /app/apps/web/package.json ./package.json

EXPOSE 3000

CMD ["npm", "run", "start"]
