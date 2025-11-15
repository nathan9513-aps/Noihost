# Dockerfile for Next.js frontend (apps/web)
FROM node:18-alpine AS builder
WORKDIR /app

# install root deps
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# copy web
COPY apps/web/package.json apps/web/package.json
COPY apps/web/package-lock.json apps/web/package-lock.json 2>/dev/null || true

COPY . .
WORKDIR /app/apps/web
RUN npm install --no-audit --no-fund

# build Next app
RUN npm run build

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/web/.next .next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/node_modules ./node_modules
COPY --from=builder /app/apps/web/package.json ./package.json

EXPOSE 3000
CMD ["npm", "run", "start"]
