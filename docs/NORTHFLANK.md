Northflank deployment guide for Turno Clone (Noihost)

This document describes how to deploy the backend (apps/api) and frontend (apps/web) to Northflank using the Dockerfiles in the repository.

Prerequisites
- A Northflank account
- Optional: A managed PostgreSQL database (Northflank can provide one) if you want production-like DB. For small demos you can keep using SQLite but it's not recommended for cloud deployments.

Services to create
1. Backend - Docker build
   - Repository: link to this GitHub repo
   - Dockerfile: /apps/api/Dockerfile
   - Build context: / (root)
   - Start command: npm run start:prod (or node dist/main.js)
   - Env variables (required):
     - DATABASE_URL (Postgres recommended, example: postgres://user:pass@host:5432/dbname)
     - JWT_SECRET
     - NODE_ENV=production
     - PORT=3001
     - Any STRIPE keys if using payments
   - Resources: 512MB - 1GB RAM recommended for build; for low-memory, set build to use a smaller machine or use Northflank build caching.

2. Frontend - Docker build
   - Repository: link to this GitHub repo
   - Dockerfile: /apps/web/Dockerfile
   - Build context: / (root)
   - Start command: npm run start
   - Env variables:
     - NEXT_PUBLIC_API_URL (point to backend service URL)
     - NODE_ENV=production
     - PORT=3000

Notes about SQLite vs Postgres
- SQLite is file-based and not suitable for multi-container cloud deployments. If you leave SQLite in production, the DB file will be internal to the container and lost on redeploys.
- Recommended: Create a PostgreSQL service in Northflank and provide its connection string as DATABASE_URL to the backend service.

Secrets and env variables
- Northflank allows adding secrets; store JWT_SECRET and Stripe keys there. Inject them as environment variables into the service.

Build tips for low-memory builders
- Use multi-stage builds to keep final image small (already in Dockerfiles).
- If build fails due to memory, try:
  - Using a larger build machine size in Northflank for the build stage only.
  - Pre-building artifacts in CI and pushing images to a registry (GitHub Container Registry) and pulling pre-built images in Northflank.

Networking
- After both services are running, point the frontend NEXT_PUBLIC_API_URL to the backend internal URL or public URL if using external access.
- Use Northflank's service discovery to connect services privately if desired.

Domains
- Northflank supports custom domains and TLS. Configure DNS to point to the service once deployed.

Troubleshooting
- If build fails due to out-of-memory while building dependencies, try enabling swap on build server or use a larger machine for the build step.
- Ensure you added .dockerignore to reduce build context.

Next steps
- Commit and push Dockerfiles and this guide to the repository.
- Create PostgreSQL on Northflank and wire up DATABASE_URL.
- Deploy backend and frontend services and test end-to-end.
