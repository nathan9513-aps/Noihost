# Multi-service Docker image with Backend API + Frontend + Nginx
FROM node:18-alpine AS deps

WORKDIR /app

# Install build tools
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy all package files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/

# Install all dependencies
RUN npm install --legacy-peer-deps

# Build Backend API
FROM node:18-alpine AS api-builder
WORKDIR /app

RUN apk add --no-cache python3 make g++

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./

# Copy API source
COPY apps/api ./apps/api

# Generate Prisma client and build
WORKDIR /app/apps/api
RUN npx prisma generate
RUN npm run build

# Build Frontend Web
FROM node:18-alpine AS web-builder
WORKDIR /app

RUN apk add --no-cache libc6-compat

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./

# Copy web source and configs
COPY apps/web/src ./apps/web/src
COPY apps/web/public ./apps/web/public
COPY apps/web/next.config.js ./apps/web/
COPY apps/web/tailwind.config.js ./apps/web/
COPY apps/web/postcss.config.js ./apps/web/
COPY apps/web/tsconfig.json ./apps/web/
COPY apps/web/package*.json ./apps/web/

WORKDIR /app/apps/web

# Link node_modules and build
RUN ln -sf /app/node_modules ./node_modules
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npx next build

# Production image with PostgreSQL + Nginx + Backend + Frontend
FROM node:18-alpine AS runner

WORKDIR /app

# Install postgresql, nginx, supervisor and OpenSSL for Prisma
RUN apk add --no-cache \
    postgresql \
    postgresql-contrib \
    nginx \
    supervisor \
    wget \
    openssl \
    openssl-dev \
    libc6-compat

# Create symlinks for OpenSSL 1.1 compatibility (Prisma requirement)
RUN ln -s /usr/lib/libssl.so.3 /usr/lib/libssl.so.1.1 || true && \
    ln -s /usr/lib/libcrypto.so.3 /usr/lib/libcrypto.so.1.1 || true

# Initialize PostgreSQL data directory
RUN mkdir -p /var/lib/postgresql/data /run/postgresql && \
    chown -R postgres:postgres /var/lib/postgresql /run/postgresql && \
    chmod 750 /var/lib/postgresql/data

# Create necessary directories
RUN mkdir -p /run/nginx /var/log/supervisor

# Copy Backend API
COPY --from=api-builder /app/apps/api/dist ./api/dist
COPY --from=api-builder /app/apps/api/prisma ./api/prisma
COPY --from=api-builder /app/apps/api/package*.json ./api/
COPY --from=api-builder /app/node_modules ./api/node_modules

# Regenerate Prisma Client for Alpine Linux (must run in target architecture)
WORKDIR /app/api
RUN npm install prisma @prisma/client --save-dev --legacy-peer-deps || true
RUN npx prisma generate --schema=./prisma/schema.prisma

# Copy Frontend Web
WORKDIR /app
COPY --from=web-builder /app/apps/web/.next ./web/.next
COPY --from=web-builder /app/apps/web/public ./web/public
COPY --from=web-builder /app/apps/web/package*.json ./web/
COPY --from=web-builder /app/apps/web/next.config.js ./web/
COPY --from=web-builder /app/node_modules ./web/node_modules

# Nginx configuration
RUN cat > /etc/nginx/http.d/default.conf <<'EOF'
server {
    listen 8080;
    server_name _;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Supervisor configuration
RUN cat > /etc/supervisord.conf <<'EOF'
[supervisord]
nodaemon=true
user=root
logfile=/var/log/supervisor/supervisord.log
pidfile=/var/run/supervisord.pid

[program:nginx]
command=/usr/sbin/nginx -g "daemon off;"
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
priority=10

[program:api]
command=node dist/main.js
directory=/app/api
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
environment=NODE_ENV="production",PORT="3001",DATABASE_URL="file:./dev.db",JWT_SECRET="noihost-production-secret-2024-change-this"
priority=20

[program:web]
command=npx next start
directory=/app/web
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
environment=NODE_ENV="production",PORT="3000",NEXT_PUBLIC_API_URL="/api"
priority=30
EOF

# PostgreSQL initialization script (not used with SQLite)
RUN cat > /usr/libexec/postgresql-start.sh <<'EOF'
#!/bin/sh
set -e

PGDATA=/var/lib/postgresql/data

# Initialize database if not exists
if [ ! -f "$PGDATA/PG_VERSION" ]; then
    echo "Initializing PostgreSQL database..."
    su-exec postgres initdb -D $PGDATA
    
    # Configure PostgreSQL
    echo "host all all 0.0.0.0/0 md5" >> $PGDATA/pg_hba.conf
    echo "listen_addresses='*'" >> $PGDATA/postgresql.conf
    echo "port=5432" >> $PGDATA/postgresql.conf
    
    # Start PostgreSQL temporarily to create database
    su-exec postgres pg_ctl -D $PGDATA -w start
    
    # Create database and user
    su-exec postgres psql -c "CREATE DATABASE noihost;"
    su-exec postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
    
    # Run Prisma migrations if exists
    if [ -d "/app/api/prisma/migrations" ]; then
        cd /app/api
        DATABASE_URL="postgresql://postgres:postgres@localhost:5432/noihost" npx prisma migrate deploy || echo "Migration failed or not needed"
    fi
    
    # Stop PostgreSQL
    su-exec postgres pg_ctl -D $PGDATA -m fast -w stop
fi

# Start PostgreSQL
exec su-exec postgres postgres -D $PGDATA
EOF

RUN chmod +x /usr/libexec/postgresql-start.sh

# Create startup script to initialize SQLite database
RUN cat > /usr/local/bin/init-db.sh <<'EOF'
#!/bin/sh
set -e

cd /app/api

# Check if database exists
if [ ! -f "./dev.db" ]; then
    echo "Initializing SQLite database..."
    DATABASE_URL="file:./dev.db" npx prisma migrate deploy || echo "Migration skipped"
    echo "Database initialized!"
else
    echo "Database already exists, skipping initialization"
fi
EOF

RUN chmod +x /usr/local/bin/init-db.sh

# Run database initialization
RUN cd /app/api && /usr/local/bin/init-db.sh

# Install su-exec for running postgres as postgres user
RUN apk add --no-cache su-exec

ENV NODE_ENV=production

# Create volume mount point for PostgreSQL data persistence
VOLUME ["/var/lib/postgresql/data"]

EXPOSE 8080 5432

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s \
  CMD wget -qO- http://localhost:8080/health || exit 1

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
