FROM node:18-alpine AS deps
WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/

# Install ALL dependencies (not just production)
RUN npm install --legacy-peer-deps

FROM node:18-alpine AS builder
WORKDIR /app

# Install libc6-compat for Alpine
RUN apk add --no-cache libc6-compat

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./

# Copy web application source and config files
COPY apps/web/src ./apps/web/src
COPY apps/web/public ./apps/web/public
COPY apps/web/next.config.js ./apps/web/
COPY apps/web/tailwind.config.js ./apps/web/
COPY apps/web/postcss.config.js ./apps/web/
COPY apps/web/tsconfig.json ./apps/web/
COPY apps/web/package*.json ./apps/web/

# Set working directory
WORKDIR /app/apps/web

# Link node_modules from parent directory
RUN ln -sf /app/node_modules ./node_modules

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV SKIP_ENV_VALIDATION=1

# Build the application
RUN npx next build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy built files
COPY --from=builder /app/apps/web/next.config.js ./
COPY --from=builder /app/apps/web/package*.json ./
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

ENV PORT=3000

CMD ["npx", "next", "start"]
