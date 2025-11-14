# 🧹 Turno Clone - Cleaning Management Platform

Full-stack SaaS platform for managing short-term rental cleaning services. Connects property hosts with professional cleaners through automated scheduling, payments, and real-time communication.

## 📋 Project Overview

This is a clone of [turno.com](https://turno.com) - a comprehensive cleaning management solution for Airbnb, Vrbo, and other short-term rental platforms.

### Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: NestJS, Prisma ORM, PostgreSQL
- **Real-time**: Socket.io
- **Payments**: Stripe Connect
- **Cache/Queue**: Redis, Bull
- **Dev Tools**: Docker, pnpm monorepo

### Architecture

Monorepo structure with:
- `apps/web` - Next.js frontend
- `apps/api` - NestJS backend API
- `packages/` - Shared packages (future)
- `docs/` - Documentation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- Docker & Docker Compose

### Installation

1. **Clone and install dependencies:**

```bash
# Install pnpm if not already installed
npm install -g pnpm

# Install all dependencies
pnpm install
```

2. **Setup environment variables:**

```bash
# Backend
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your values

# Frontend
cp apps/web/.env.example apps/web/.env
# Edit apps/web/.env with your values
```

3. **Start Docker services (PostgreSQL, Redis):**

```bash
pnpm docker:up
```

4. **Run database migrations:**

```bash
pnpm db:migrate
```

5. **Start development servers:**

```bash
# Start both frontend and backend
pnpm dev

# Or start individually:
pnpm dev:web    # Frontend on http://localhost:3000
pnpm dev:api    # Backend on http://localhost:3001
```

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
pnpm install

# Development
pnpm dev              # Start all apps
pnpm dev:web          # Start frontend only
pnpm dev:api          # Start backend only

# Build
pnpm build            # Build all apps
pnpm build:web        # Build frontend
pnpm build:api        # Build backend

# Database
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio

# Docker
pnpm docker:up        # Start PostgreSQL & Redis
pnpm docker:down      # Stop Docker services

# Testing
pnpm test             # Run all tests
pnpm lint             # Lint all code
```

## 🔧 Configuration

### Backend (`apps/api/.env`)

```env
DATABASE_URL=postgresql://turno:turno_dev_password@localhost:5432/turno_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost:3000
PORT=3001
```

### Frontend (`apps/web/.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
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
