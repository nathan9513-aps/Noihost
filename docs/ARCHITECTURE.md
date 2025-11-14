# 🏗️ ARCHITETTURA & STRUTTURA CODICE

## Backend API Structure (NestJS)

```
apps/api/src/
├── main.ts                          # Entry point
├── app.module.ts                    # Root module
│
├── auth/                            # Authentication
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   ├── local.strategy.ts
│   │   └── google.strategy.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   └── roles.decorator.ts
│   └── dto/
│       ├── register.dto.ts
│       ├── login.dto.ts
│       └── reset-password.dto.ts
│
├── users/                           # User management
│   ├── users.module.ts
│   ├── users.service.ts
│   ├── users.controller.ts
│   ├── entities/
│   │   └── user.entity.ts
│   └── dto/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
│
├── properties/                      # Property management
│   ├── properties.module.ts
│   ├── properties.service.ts
│   ├── properties.controller.ts
│   ├── entities/
│   │   └── property.entity.ts
│   └── dto/
│       ├── create-property.dto.ts
│       └── update-property.dto.ts
│
├── bookings/                        # Booking management
│   ├── bookings.module.ts
│   ├── bookings.service.ts
│   ├── bookings.controller.ts
│   ├── entities/
│   │   └── booking.entity.ts
│   └── dto/
│       ├── create-booking.dto.ts
│       └── update-booking.dto.ts
│
├── cleaning-jobs/                   # Cleaning job management
│   ├── cleaning-jobs.module.ts
│   ├── cleaning-jobs.service.ts
│   ├── cleaning-jobs.controller.ts
│   ├── scheduling/
│   │   ├── auto-scheduler.service.ts    # Auto-scheduling logic
│   │   └── scheduling.utils.ts
│   ├── entities/
│   │   └── cleaning-job.entity.ts
│   └── dto/
│       ├── create-cleaning-job.dto.ts
│       └── update-cleaning-job.dto.ts
│
├── cleaners/                        # Cleaner profiles
│   ├── cleaners.module.ts
│   ├── cleaners.service.ts
│   ├── cleaners.controller.ts
│   ├── marketplace/
│   │   ├── marketplace.service.ts       # Search & discovery
│   │   └── matching.service.ts          # Matching algorithm
│   ├── entities/
│   │   └── cleaner-profile.entity.ts
│   └── dto/
│       ├── create-cleaner-profile.dto.ts
│       └── search-cleaners.dto.ts
│
├── bids/                            # Bidding system
│   ├── bids.module.ts
│   ├── bids.service.ts
│   ├── bids.controller.ts
│   ├── entities/
│   │   └── bid.entity.ts
│   └── dto/
│       ├── create-bid.dto.ts
│       └── accept-bid.dto.ts
│
├── payments/                        # Payment processing
│   ├── payments.module.ts
│   ├── payments.service.ts
│   ├── payments.controller.ts
│   ├── stripe/
│   │   ├── stripe.service.ts
│   │   ├── stripe-connect.service.ts
│   │   └── stripe-webhook.controller.ts
│   ├── entities/
│   │   └── payment.entity.ts
│   └── dto/
│       ├── create-payment.dto.ts
│       └── process-payment.dto.ts
│
├── reviews/                         # Review & rating system
│   ├── reviews.module.ts
│   ├── reviews.service.ts
│   ├── reviews.controller.ts
│   ├── entities/
│   │   └── review.entity.ts
│   └── dto/
│       ├── create-review.dto.ts
│       └── update-review.dto.ts
│
├── messages/                        # Chat messaging
│   ├── messages.module.ts
│   ├── messages.service.ts
│   ├── messages.controller.ts
│   ├── messages.gateway.ts          # WebSocket
│   ├── entities/
│   │   └── message.entity.ts
│   └── dto/
│       ├── create-message.dto.ts
│       └── send-message.dto.ts
│
├── notifications/                   # Notification system
│   ├── notifications.module.ts
│   ├── notifications.service.ts
│   ├── notifications.controller.ts
│   ├── notifications.gateway.ts     # Real-time notifications
│   ├── providers/
│   │   ├── email.provider.ts        # Email via SendGrid
│   │   ├── push.provider.ts         # Push notifications
│   │   └── sms.provider.ts          # SMS via Twilio
│   ├── entities/
│   │   └── notification.entity.ts
│   └── dto/
│       └── create-notification.dto.ts
│
├── calendar-sync/                   # Calendar integrations
│   ├── calendar-sync.module.ts
│   ├── calendar-sync.service.ts
│   ├── calendar-sync.controller.ts
│   ├── providers/
│   │   ├── airbnb.provider.ts
│   │   ├── vrbo.provider.ts
│   │   ├── booking.provider.ts
│   │   └── ical.provider.ts
│   ├── jobs/
│   │   └── sync-calendar.job.ts     # Cron job
│   ├── entities/
│   │   └── calendar-sync.entity.ts
│   └── dto/
│       └── sync-calendar.dto.ts
│
├── inventory/                       # Inventory management
│   ├── inventory.module.ts
│   ├── inventory.service.ts
│   ├── inventory.controller.ts
│   ├── entities/
│   │   └── inventory-item.entity.ts
│   └── dto/
│       ├── create-inventory-item.dto.ts
│       └── update-stock.dto.ts
│
├── checklists/                      # Photo checklists
│   ├── checklists.module.ts
│   ├── checklists.service.ts
│   ├── checklists.controller.ts
│   ├── entities/
│   │   ├── checklist-template.entity.ts
│   │   └── checklist-submission.entity.ts
│   └── dto/
│       ├── create-checklist.dto.ts
│       └── submit-checklist.dto.ts
│
├── admin/                           # Admin panel
│   ├── admin.module.ts
│   ├── admin.service.ts
│   ├── admin.controller.ts
│   ├── analytics/
│   │   └── analytics.service.ts
│   └── disputes/
│       ├── disputes.service.ts
│       └── disputes.controller.ts
│
├── uploads/                         # File upload
│   ├── uploads.module.ts
│   ├── uploads.service.ts
│   ├── uploads.controller.ts
│   └── providers/
│       ├── s3.provider.ts           # AWS S3
│       └── cloudinary.provider.ts   # Cloudinary
│
├── common/                          # Shared utilities
│   ├── decorators/
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── guards/
│   ├── interceptors/
│   │   ├── logging.interceptor.ts
│   │   └── transform.interceptor.ts
│   ├── pipes/
│   │   └── validation.pipe.ts
│   ├── middlewares/
│   └── utils/
│       ├── date.utils.ts
│       ├── geocoding.utils.ts
│       └── currency.utils.ts
│
├── database/                        # Database
│   ├── database.module.ts
│   ├── prisma.service.ts            # Prisma client
│   └── seeds/
│       └── seed.ts
│
└── config/                          # Configuration
    ├── app.config.ts
    ├── database.config.ts
    ├── jwt.config.ts
    └── stripe.config.ts
```

---

## Frontend Structure (Next.js 14 App Router)

```
apps/web/src/
├── app/                             # Next.js App Router
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Homepage
│   ├── globals.css                  # Global styles
│   │
│   ├── (auth)/                      # Auth group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/                 # Dashboard group (protected)
│   │   ├── layout.tsx               # Dashboard layout with sidebar
│   │   │
│   │   ├── host/                    # Host dashboard
│   │   │   ├── page.tsx             # Overview
│   │   │   ├── properties/
│   │   │   │   ├── page.tsx         # Properties list
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx     # Property details
│   │   │   │   └── new/
│   │   │   │       └── page.tsx     # Add property
│   │   │   ├── calendar/
│   │   │   │   └── page.tsx         # Calendar view
│   │   │   ├── bookings/
│   │   │   │   └── page.tsx
│   │   │   ├── cleanings/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── cleaners/
│   │   │   │   ├── page.tsx         # My cleaners
│   │   │   │   ├── search/
│   │   │   │   │   └── page.tsx     # Find cleaners
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx     # Cleaner profile
│   │   │   ├── payments/
│   │   │   │   └── page.tsx
│   │   │   ├── messages/
│   │   │   │   └── page.tsx
│   │   │   ├── reviews/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   ├── cleaner/                 # Cleaner dashboard
│   │   │   ├── page.tsx             # Overview
│   │   │   ├── jobs/
│   │   │   │   ├── page.tsx         # Job list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx     # Job details
│   │   │   ├── marketplace/
│   │   │   │   └── page.tsx         # Browse opportunities
│   │   │   ├── earnings/
│   │   │   │   └── page.tsx
│   │   │   ├── messages/
│   │   │   │   └── page.tsx
│   │   │   ├── reviews/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   └── admin/                   # Admin panel
│   │       ├── page.tsx
│   │       ├── users/
│   │       ├── jobs/
│   │       ├── payments/
│   │       ├── disputes/
│   │       └── analytics/
│   │
│   └── api/                         # API routes (if needed)
│       └── webhooks/
│           └── stripe/
│               └── route.ts
│
├── components/                      # React components
│   ├── ui/                          # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── calendar.tsx
│   │   ├── table.tsx
│   │   └── ...
│   │
│   ├── layout/                      # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   │
│   ├── auth/                        # Auth components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── property/                    # Property components
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyForm.tsx
│   │   ├── PropertyList.tsx
│   │   ├── PropertyDetails.tsx
│   │   └── PropertyPhotos.tsx
│   │
│   ├── calendar/                    # Calendar components
│   │   ├── CalendarView.tsx
│   │   ├── BookingEvent.tsx
│   │   ├── CleaningEvent.tsx
│   │   └── MonthView.tsx
│   │
│   ├── cleaning/                    # Cleaning components
│   │   ├── CleaningJobCard.tsx
│   │   ├── CleaningJobForm.tsx
│   │   ├── CleaningJobList.tsx
│   │   ├── ChecklistView.tsx
│   │   └── PhotoUpload.tsx
│   │
│   ├── cleaner/                     # Cleaner components
│   │   ├── CleanerCard.tsx
│   │   ├── CleanerProfile.tsx
│   │   ├── CleanerSearch.tsx
│   │   ├── CleanerFilters.tsx
│   │   └── CleanerMap.tsx
│   │
│   ├── bid/                         # Bidding components
│   │   ├── BidForm.tsx
│   │   ├── BidList.tsx
│   │   ├── BidCard.tsx
│   │   └── BidComparison.tsx
│   │
│   ├── payment/                     # Payment components
│   │   ├── PaymentForm.tsx
│   │   ├── PaymentHistory.tsx
│   │   ├── StripeConnect.tsx
│   │   └── InvoiceView.tsx
│   │
│   ├── messaging/                   # Chat components
│   │   ├── ChatWindow.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageInput.tsx
│   │   ├── ConversationList.tsx
│   │   └── UserAvatar.tsx
│   │
│   ├── notification/                # Notification components
│   │   ├── NotificationBell.tsx
│   │   ├── NotificationList.tsx
│   │   └── NotificationItem.tsx
│   │
│   ├── review/                      # Review components
│   │   ├── ReviewForm.tsx
│   │   ├── ReviewList.tsx
│   │   ├── ReviewCard.tsx
│   │   └── RatingStars.tsx
│   │
│   └── dashboard/                   # Dashboard components
│       ├── StatsCard.tsx
│       ├── Chart.tsx
│       ├── RecentActivity.tsx
│       └── QuickActions.tsx
│
├── lib/                             # Utilities & helpers
│   ├── api.ts                       # API client (axios)
│   ├── auth.ts                      # Auth helpers
│   ├── socket.ts                    # Socket.io client
│   ├── utils.ts                     # General utilities
│   ├── cn.ts                        # className utility
│   ├── date.ts                      # Date utilities
│   └── validators.ts                # Validation schemas
│
├── hooks/                           # Custom React hooks
│   ├── useAuth.ts
│   ├── useUser.ts
│   ├── useProperties.ts
│   ├── useCleaningJobs.ts
│   ├── useCleaners.ts
│   ├── useMessages.ts
│   ├── useNotifications.ts
│   ├── useSocket.ts
│   ├── usePayments.ts
│   └── useReviews.ts
│
├── store/                           # Zustand state management
│   ├── authStore.ts
│   ├── userStore.ts
│   ├── notificationStore.ts
│   └── chatStore.ts
│
├── types/                           # TypeScript types
│   ├── user.ts
│   ├── property.ts
│   ├── booking.ts
│   ├── cleaning-job.ts
│   ├── cleaner.ts
│   ├── payment.ts
│   ├── message.ts
│   ├── notification.ts
│   └── index.ts
│
└── config/                          # Configuration
    ├── api.config.ts
    └── constants.ts
```

---

## Database Schema (Prisma)

Already created in `apps/api/prisma/schema.prisma` with:

**18 Tables:**
1. User
2. CleanerProfile
3. Property
4. Booking
5. CleaningJob
6. Bid
7. Payment
8. Review
9. Message
10. Notification
11. InventoryItem
12. CalendarSync
13. (+ more as needed)

**Key Relations:**
- User → Properties (1:many)
- User → CleanerProfile (1:1)
- Property → Bookings (1:many)
- Booking → CleaningJobs (1:many)
- CleaningJob → Bids (1:many)
- CleaningJob → Payment (1:1)
- User → Reviews (given/received)
- User → Messages (sent/received)

---

## API Endpoints Structure

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/me
```

### Users
```
GET    /api/users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
```

### Properties
```
GET    /api/properties
POST   /api/properties
GET    /api/properties/:id
PATCH  /api/properties/:id
DELETE /api/properties/:id
POST   /api/properties/:id/photos
```

### Bookings
```
GET    /api/bookings
POST   /api/bookings
GET    /api/bookings/:id
PATCH  /api/bookings/:id
DELETE /api/bookings/:id
```

### Cleaning Jobs
```
GET    /api/cleaning-jobs
POST   /api/cleaning-jobs
GET    /api/cleaning-jobs/:id
PATCH  /api/cleaning-jobs/:id
DELETE /api/cleaning-jobs/:id
POST   /api/cleaning-jobs/:id/assign
POST   /api/cleaning-jobs/:id/complete
POST   /api/cleaning-jobs/:id/report-problem
```

### Cleaners
```
GET    /api/cleaners
GET    /api/cleaners/:id
PATCH  /api/cleaners/:id
GET    /api/cleaners/search (with filters)
POST   /api/cleaners/:id/favorite
```

### Bids
```
GET    /api/bids
POST   /api/bids
GET    /api/bids/:id
PATCH  /api/bids/:id/accept
DELETE /api/bids/:id
```

### Payments
```
GET    /api/payments
POST   /api/payments
GET    /api/payments/:id
POST   /api/payments/stripe/connect
POST   /api/payments/stripe/webhook
GET    /api/payments/earnings
```

### Reviews
```
GET    /api/reviews
POST   /api/reviews
GET    /api/reviews/:id
PATCH  /api/reviews/:id
DELETE /api/reviews/:id
```

### Messages
```
GET    /api/messages
POST   /api/messages
GET    /api/messages/:id
GET    /api/messages/conversations
PATCH  /api/messages/:id/read
```

### Notifications
```
GET    /api/notifications
PATCH  /api/notifications/:id/read
PATCH  /api/notifications/read-all
```

### Calendar Sync
```
GET    /api/calendar-sync
POST   /api/calendar-sync
POST   /api/calendar-sync/:id/sync
DELETE /api/calendar-sync/:id
```

### Inventory
```
GET    /api/inventory
POST   /api/inventory
PATCH  /api/inventory/:id
DELETE /api/inventory/:id
```

### Admin
```
GET    /api/admin/users
GET    /api/admin/analytics
GET    /api/admin/disputes
PATCH  /api/admin/users/:id/ban
```

---

## WebSocket Events (Socket.io)

### Client → Server
```
connect
disconnect
message:send
message:typing
notification:subscribe
cleaning-job:update
```

### Server → Client
```
message:new
message:typing
notification:new
cleaning-job:assigned
cleaning-job:completed
payment:received
```

---

## Environment Variables

### Backend (.env)
```
DATABASE_URL=
REDIS_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
SENDGRID_API_KEY=
FRONTEND_URL=
PORT=
NODE_ENV=
```

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SOCKET_URL=
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=
```

---

## Tech Stack Details

### Backend
- **Framework**: NestJS 10
- **ORM**: Prisma 5
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Queue**: Bull (Redis-based)
- **WebSocket**: Socket.io
- **Payments**: Stripe Connect
- **Email**: SendGrid / AWS SES
- **Storage**: AWS S3 / Cloudinary
- **Auth**: Passport JWT
- **Validation**: class-validator
- **Testing**: Jest

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State**: Zustand
- **Data Fetching**: TanStack Query
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **WebSocket**: socket.io-client
- **Date**: date-fns
- **Maps**: Mapbox / Google Maps
- **Charts**: Recharts
- **Testing**: Vitest + Testing Library

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel (frontend) + AWS/Railway (backend)
- **Monitoring**: Sentry, DataDog
- **Logging**: Winston

---

**Questa struttura è pronta per iniziare lo sviluppo!** 🚀
