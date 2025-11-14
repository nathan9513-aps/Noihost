# Turno Clone - Cleaning Management Platform

## Project Overview
Full-stack SaaS platform for managing short-term rental cleaning services (Airbnb, Vrbo). Connects property hosts with professional cleaners through automated scheduling, payments, and communication.

## Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: NestJS, Prisma ORM, SQLite (dev) / PostgreSQL (prod)
- **Real-time**: Socket.io
- **Payments**: Stripe Connect
- **Mobile**: React Native (future)
- **Dev**: npm (no Docker required)

## Architecture
Multi-tenant SaaS with three user roles:
- **Hosts**: Manage properties, bookings, assign cleaners
- **Cleaners**: Accept jobs, complete checklists, receive payments
- **Admins**: Platform management, disputes, analytics

## Key Features
- Calendar sync (Airbnb, Vrbo, iCal)
- Auto-scheduling cleaning jobs
- Cleaner marketplace with bidding
- Real-time chat & notifications
- Photo checklists & problem reporting
- Automated payments via Stripe Connect
- Review & rating system
- Mobile apps (iOS/Android)

## Development Setup Completed ✅
✅ Project structure scaffolded (monorepo with npm)
✅ Frontend (Next.js 14 + TypeScript + Tailwind) initialized
✅ Backend (NestJS + Prisma ORM) initialized
✅ Database schema (18 tables) designed & migrated
✅ SQLite database setup (no Docker needed)
✅ Environment files configured
✅ Prisma Client generated
✅ Dependencies installed (1142 packages)
✅ Test script created
✅ Hardware optimizations applied
✅ Complete documentation:
  - README.md - Full project guide
  - GETTING_STARTED.md - Quick start & next steps
  - TEST_RESULTS.md - Setup test results
  - docs/TIMELINE.md - Development timeline & costs
  - docs/FEATURES.md - 500+ features identified
  - docs/ARCHITECTURE.md - Complete code structure
  - docs/SETUP_NO_DOCKER.md - Setup without Docker
  - docs/HARDWARE_OPTIMIZATION.md - Performance tips

## Current Status
🟢 **READY - STARTING FEATURE DEVELOPMENT**
📅 **Phase**: Week 1 - Authentication & User Management

## Development Progress

### Week 1: Auth & Users (IN PROGRESS) 🚧
- [x] Database module with Prisma
- [x] Auth module (JWT strategy, guards, decorators)
- [x] User CRUD endpoints structure
- [ ] Complete auth endpoints (register, login, JWT)
- [ ] Password hashing (bcrypt)
- [ ] Login/Register pages (frontend)
- [ ] Protected routes
- [ ] User profile management
📅 **Phase**: Week 1 - Authentication & User Management

## Development Progress

### Week 1: Auth & Users (IN PROGRESS) 🚧
- [ ] Auth module (register, login, JWT)
- [ ] User CRUD endpoints
- [ ] Password hashing (bcrypt)
- [ ] Auth guards & decorators
- [ ] Login/Register pages (frontend)
- [ ] Protected routes
- [ ] User profile management

### Week 2: Properties & Bookings (PLANNED)
- [ ] Property CRUD endpoints
- [ ] Property management pages
- [ ] Photo upload
- [ ] Booking CRUD
- [ ] Calendar view

### Week 3: Cleaning Jobs (PLANNED)
- [ ] CleaningJob CRUD
- [ ] Job assignment logic
- [ ] Dashboard host
- [ ] Dashboard cleaner

## Setup Instructions (NO DOCKER)
```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Setup backend environment
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env (DATABASE_URL is already set for SQLite)

# 3. Generate Prisma Client & migrate
cd apps/api
npx prisma generate
npx prisma migrate dev --name init

# 4. Start development
cd ../..
npm run dev:api    # Backend on :3001
npm run dev:web    # Frontend on :3000

# 5. View database
npm run db:studio  # Opens on :5555
```

## Database
- **Type**: SQLite (file-based, zero config)
- **Location**: `apps/api/prisma/dev.db`
- **Size**: 132KB
- **Tables**: 18 (Users, Properties, Bookings, CleaningJobs, etc.)
- **Note**: Enums converted to String for SQLite compatibility

## Quick Commands
```bash
npm run dev          # Start both servers
npm run dev:api      # Backend only
npm run dev:web      # Frontend only
npm run db:studio    # Database UI
npm run db:migrate   # Run migrations
./test-setup.sh      # Test setup
```

## API Endpoints (Implemented)
- `GET /api` - Welcome message
- `GET /api/health` - Health check

## Estimated Timeline
- **MVP (working prototype)**: 8-10 weeks
- **Full platform**: 20-26 weeks (6 months)
- **Current week**: 1/26

## Notes for Development
- Use SQLite for development (already configured)
- Database file: `apps/api/prisma/dev.db`
- Prisma Studio for database management
- TypeScript strict mode enabled
- Validation with class-validator
- All features documented in `docs/FEATURES.md`
