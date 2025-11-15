# 🧹 Turno Clone - Cleaning Management Platform

Full-stack SaaS platform for managing short-term rental cleaning services. Connects property hosts with professional cleaners through automated scheduling, payments, and real-time communication.

## 📋 Project Overview

This is a clone of [turno.com](https://turno.com) - a comprehensive cleaning management solution for Airbnb, Vrbo, and other short-term rental platforms.

### Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: NestJS, Prisma ORM, SQLite (dev) / PostgreSQL (prod)
- **Real-time**: Socket.io
- **Payments**: Stripe Connect
- **Dev Tools**: npm workspaces (no Docker required!)
- **Deployment**: Railway (free tier available)

### Architecture

Monorepo structure with:
- `apps/web` - Next.js frontend
- `apps/api` - NestJS backend API
- `packages/` - Shared packages (future)
- `docs/` - Documentation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 10+ (viene con Node.js)
- **NO Docker necessario!** ✅

### Local Development (5 minuti)

1. **Clone and install dependencies:**

```bash
# Install dependencies
npm install --legacy-peer-deps
```

2. **Setup environment variables:**

```bash
# Backend
cp apps/api/.env.example apps/api/.env
# DATABASE_URL è già configurato per SQLite
```

3. **Setup database (SQLite):**

```bash
cd apps/api
npx prisma generate
npx prisma migrate dev --name init
cd ../..
```

4. **Start development servers:**

```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run dev:web    # Frontend on http://localhost:3000
npm run dev:api    # Backend on http://localhost:3001

# Database UI
npm run db:studio  # Opens on http://localhost:5555
```

## 🚀 Deployment

### Opzione 1: All-in-One (Più Economico - Database Integrato!) 💰

**Immagine Docker completa con PostgreSQL + Backend + Frontend + Nginx!**

```bash
# Un'unica immagine self-contained con tutto
ghcr.io/nathan9513-aps/noihost/all-in-one:latest
```

**Cosa include:**
- ✅ PostgreSQL 15 (database integrato)
- ✅ NestJS Backend (API)
- ✅ Next.js Frontend (web)
- ✅ Nginx (reverse proxy)

**Vantaggi:**
- ✅ **60-70% più economico** ($6-10/mese invece di $15-25)
- ✅ Un solo servizio da configurare
- ✅ Zero setup database esterno
- ✅ Completamente self-contained
- ✅ Perfetto per MVP, demo e piccoli progetti

**Guida completa:** [`docs/DEPLOY_ALL_IN_ONE.md`](docs/DEPLOY_ALL_IN_ONE.md)

### Opzione 2: Northflank (Servizi Separati - Più Scalabile)

**Immagini Docker pre-compilate via GitHub Actions!**

```bash
# Backend e Frontend separati
ghcr.io/nathan9513-aps/noihost/api:latest
ghcr.io/nathan9513-aps/noihost/web:latest
```

**Vantaggi:**
- ✅ Scaling indipendente
- ✅ High availability
- ✅ Perfetto per produzione

**Guida completa:** [`docs/DEPLOY_NORTHFLANK.md`](docs/DEPLOY_NORTHFLANK.md)

### Opzione 3: Railway (Alternativa)

**Tempo stimato: 20 minuti**

Segui la checklist: [`RAILWAY_DEPLOY_CHECKLIST.md`](RAILWAY_DEPLOY_CHECKLIST.md)

**Quick steps:**
1. Vai su [railway.app](https://railway.app) e login con GitHub
2. New Project → Deploy from GitHub → Seleziona `Noihost`
3. Add Database → PostgreSQL
4. Configura variabili ambiente
5. ✅ Live!

**Dettagli:** [`docs/DEPLOY_RAILWAY.md`](docs/DEPLOY_RAILWAY.md)

### Docker Images

Vedi [`DOCKER_IMAGES.md`](DOCKER_IMAGES.md) per info sulle immagini Docker pubblicate automaticamente.

## 📁 Project Structure

```
turno-clone/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   └── ...
│   │   ├── prisma/
│   │   │   └── schema.prisma   # Database schema
│   │   ├── package.json
│   │   └── .env.example
│   │
│   └── web/                    # Next.js Frontend
│       ├── src/
│       │   └── app/
│       ├── public/
│       ├── package.json
│       └── .env.example
│
├── packages/                   # Shared packages (future)
├── docs/                       # Documentation
├── docker-compose.yml          # Docker services
├── package.json                # Root package.json
├── pnpm-workspace.yaml
└── README.md
```

## 🗃️ Database Schema

Key entities:
- **Users** (HOST, CLEANER, ADMIN roles)
- **Properties** (rental units)
- **Bookings** (guest reservations)
- **CleaningJobs** (scheduled cleanings)
- **Payments** (via Stripe Connect)
- **Reviews** (ratings system)
- **Messages** (in-app chat)
- **Notifications**
- **CalendarSync** (Airbnb/Vrbo integration)

View full schema: `apps/api/prisma/schema.prisma`

## 🎯 Core Features

### For Hosts
- ✅ Multi-property management
- ✅ Calendar sync (Airbnb, Vrbo, iCal)
- ✅ Auto-scheduling cleaning jobs
- ✅ Cleaner marketplace with bidding
- ✅ Automated payments via Stripe
- ✅ Photo checklists & problem reporting
- ✅ Real-time chat with cleaners
- ✅ Review & rating system
- ✅ Dashboard & analytics

### For Cleaners
- ✅ Job marketplace
- ✅ Accept/reject cleaning assignments
- ✅ Bidding on open jobs
- ✅ Auto payments to bank account
- ✅ Photo checklist completion
- ✅ Problem/damage reporting
- ✅ Chat with hosts
- ✅ Calendar management
- ✅ Profile & portfolio

### Admin Panel
- ✅ User management
- ✅ Dispute resolution
- ✅ Platform analytics
- ✅ Payment monitoring
- ✅ Content management

## 🛠️ Development Commands

```bash
# Install dependencies
npm install --legacy-peer-deps

# Development
npm run dev              # Start all apps
npm run dev:web          # Start frontend only
npm run dev:api          # Start backend only

# Build
npm run build            # Build all apps
npm run build:web        # Build frontend
npm run build:api        # Build backend

# Database
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio
npm run db:generate      # Generate Prisma Client

# Database switching (SQLite <-> PostgreSQL)
npm run db:switch:sqlite    # Switch to SQLite for local dev
npm run db:switch:postgres  # Switch to PostgreSQL for Railway
npm run deploy:prepare      # Prepare for Railway deploy

# Testing
npm test             # Run all tests
npm run lint         # Lint all code
```

## 🔧 Configuration

### Backend (`apps/api/.env`)

```env
# Development (SQLite)
DATABASE_URL="file:./dev.db"

# Production (PostgreSQL - Railway)
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Stripe (opzionale per ora)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PLATFORM_FEE_PERCENT=10

# Server
PORT=3001
NODE_ENV=development
```

### Frontend (`apps/web/.env`)

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Stripe (quando pronto)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
```

## 📅 Development Roadmap

### Phase 1: MVP (12 weeks)
- ✅ Project setup & architecture
- ⏳ Authentication & user management
- ⏳ Property management
- ⏳ Basic calendar & booking system
- ⏳ Cleaner marketplace
- ⏳ Cleaning job management
- ⏳ Payment integration (Stripe)
- ⏳ Basic messaging
- ⏳ Review system

### Phase 2: Advanced Features (8 weeks)
- ⏳ Auto-scheduling algorithm
- ⏳ Real-time notifications (Socket.io)
- ⏳ Photo checklists
- ⏳ Problem reporting
- ⏳ Inventory management
- ⏳ Calendar sync (Airbnb/Vrbo APIs)
- ⏳ Dashboard analytics
- ⏳ Admin panel

### Phase 3: Mobile & Polish (6 weeks)
- ⏳ React Native mobile apps
- ⏳ Push notifications
- ⏳ Advanced analytics
- ⏳ SEO optimization
- ⏳ Performance optimization
- ⏳ Security audit

**Total Estimated Time: 26 weeks (~6 months) for full platform**

## ⏱️ Time Estimates

### MVP Prototype (Working Demo)
**Time: 8-10 weeks**

Features included:
- User authentication (host/cleaner)
- Property CRUD
- Manual cleaning job creation
- Basic cleaner search
- Simple payments
- Core messaging
- Basic dashboard

### Production-Ready Platform
**Time: 20-26 weeks**

Includes all features from turno.com:
- Full calendar sync
- Auto-scheduling
- Marketplace & bidding
- Complete payment system
- Mobile apps
- Admin panel
- Production deployment

### Team Requirements

**MVP (10 weeks):**
- 1 Full-stack developer (solo) OR
- 2 developers (frontend + backend) = 5-6 weeks

**Full Platform (26 weeks):**
- 1 Senior Full-stack (lead)
- 1 Frontend developer
- 1 Backend developer
- 1 Mobile developer (part-time)
- 1 UI/UX designer (part-time)

## 🔐 Security

- JWT authentication
- Bcrypt password hashing
- CORS configuration
- Rate limiting (NestJS Throttler)
- Input validation (class-validator)
- SQL injection prevention (Prisma ORM)
- XSS protection

## 📊 API Documentation

Once running, access:
- API Health: http://localhost:3001/api/health
- Prisma Studio: `pnpm db:studio`

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:cov
```

## 🚀 Deployment

### Backend (NestJS)
- Recommended: AWS ECS, DigitalOcean App Platform, Railway
- Database: AWS RDS (PostgreSQL), Supabase
- Redis: AWS ElastiCache, Upstash

### Frontend (Next.js)
- Recommended: Vercel, Netlify
- Alternative: AWS Amplify, Cloudflare Pages

### Docker Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📝 Environment Variables

See `.env.example` files in:
- `apps/api/.env.example`
- `apps/web/.env.example`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file

## 🆘 Support

For issues and questions:
- GitHub Issues: [Create an issue](#)
- Documentation: `/docs` folder

## 🎯 Next Steps

1. ✅ Install dependencies: `pnpm install`
2. ✅ Start Docker: `pnpm docker:up`
3. ⏳ Run migrations: `pnpm db:migrate`
4. ⏳ Start dev servers: `pnpm dev`
5. ⏳ Open http://localhost:3000

---

**Status**: 🟢 Development Ready | **Version**: 1.0.0 | **Last Updated**: November 2025
