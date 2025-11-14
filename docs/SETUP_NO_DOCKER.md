# 🚀 SETUP SENZA DOCKER - Guida Semplificata

## Opzione Consigliata: SQLite (Più Semplice)

SQLite è un database che non richiede nessun server separato - perfetto per sviluppo!

### Step 1: Usa Schema SQLite

```bash
# Copia lo schema SQLite
cd apps/api/prisma
cp schema.sqlite.prisma schema.prisma
```

### Step 2: Configura Environment

```bash
# Copia template
cp apps/api/.env.example apps/api/.env
```

Modifica `apps/api/.env`:
```env
# Database SQLite (file locale)
DATABASE_URL="file:./dev.db"

# Redis (OPZIONALE - commenta se non usi)
# REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="super-secret-change-this-in-production-12345"
JWT_EXPIRES_IN="7d"

# Stripe (lascia vuoto per ora)
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PLATFORM_FEE_PERCENT=10

# Email (lascia vuoto per ora)
SENDGRID_API_KEY=""
FROM_EMAIL="noreply@turno-clone.com"

# Frontend
FRONTEND_URL="http://localhost:3000"

# API
PORT=3001
NODE_ENV="development"
```

### Step 3: Setup Database

```bash
cd apps/api

# Genera Prisma Client
npx prisma generate

# Crea database e tabelle
npx prisma migrate dev --name init

# (Opzionale) Apri Prisma Studio per vedere il database
npx prisma studio
```

Questo creerà automaticamente un file `dev.db` in `apps/api/prisma/`

### Step 4: Avvia Applicazione

```bash
# Torna alla root
cd ../..

# Avvia backend (in un terminale)
npm run dev:api

# Avvia frontend (in altro terminale)
npm run dev:web
```

### Step 5: Verifica

1. **Backend**: http://localhost:3001/api/health
   - Dovresti vedere: `{"status":"ok",...}`

2. **Frontend**: http://localhost:3000
   - Dovresti vedere la homepage

3. **Database**: 
   ```bash
   cd apps/api
   npx prisma studio
   ```
   - Si apre interfaccia per vedere/modificare dati

---

## Opzione Alternativa: PostgreSQL Locale

Se preferisci PostgreSQL (come production):

### Step 1: Installa PostgreSQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql
brew services start postgresql

# Avvia servizio
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Step 2: Crea Database

```bash
# Accedi a PostgreSQL
sudo -u postgres psql

# Dentro psql, esegui:
CREATE USER turno WITH PASSWORD 'turno_dev_password';
CREATE DATABASE turno_dev OWNER turno;
GRANT ALL PRIVILEGES ON DATABASE turno_dev TO turno;
\q
```

### Step 3: Configura Environment

Modifica `apps/api/.env`:
```env
DATABASE_URL="postgresql://turno:turno_dev_password@localhost:5432/turno_dev?schema=public"
```

### Step 4: Setup Database

```bash
cd apps/api

# Lo schema PostgreSQL è già quello predefinito in schema.prisma
npx prisma generate
npx prisma migrate dev --name init
```

---

## Redis (Opzionale)

Redis è usato per cache e real-time. Non è obbligatorio per iniziare.

### Installazione Redis

```bash
# Ubuntu/Debian
sudo apt install redis-server
sudo systemctl start redis
sudo systemctl enable redis

# macOS
brew install redis
brew services start redis

# Test
redis-cli ping
# Dovrebbe rispondere: PONG
```

Se NON vuoi usare Redis:
1. Commenta `REDIS_URL` in `.env`
2. Disabilita moduli Redis nel backend (quando implementati)

---

## Risoluzione Problemi

### Errore: "Can't reach database server"

**SQLite:**
- Verifica che `DATABASE_URL="file:./dev.db"` in `.env`
- Riprova: `npx prisma migrate dev --name init`

**PostgreSQL:**
- Verifica che PostgreSQL sia avviato: `sudo systemctl status postgresql`
- Testa connessione: `psql -U turno -d turno_dev -h localhost`
- Verifica password in `DATABASE_URL`

### Errore: "prisma command not found"

```bash
cd apps/api
npm install
npx prisma generate
```

### Port già in uso

```bash
# Trova processo
lsof -ti:3001

# Uccidi processo
kill -9 $(lsof -ti:3001)
```

---

## Vantaggi di Ogni Opzione

### SQLite ✅
- ✅ Zero configurazione
- ✅ Un solo file database
- ✅ Perfetto per sviluppo
- ✅ Facile backup (copia file)
- ❌ Non ideale per production
- ❌ Meno performante con molti utenti

### PostgreSQL ✅
- ✅ Database production-ready
- ✅ Performance migliori
- ✅ Features avanzate
- ✅ Identico a production
- ❌ Richiede server separato
- ❌ Più complesso da configurare

### Consiglio
- **Sviluppo iniziale**: SQLite
- **Quando pronto per deploy**: Migra a PostgreSQL

---

## Migrazione SQLite → PostgreSQL

Quando vuoi passare a PostgreSQL:

```bash
cd apps/api/prisma

# 1. Backup SQLite
cp dev.db dev.db.backup

# 2. Ripristina schema PostgreSQL originale
git checkout schema.prisma

# 3. Cambia DATABASE_URL in .env
# DATABASE_URL="postgresql://..."

# 4. Ricrea database
npx prisma migrate dev --name init

# 5. (Opzionale) Migra dati con tool tipo pgloader
```

---

## Test Rapido Setup

```bash
# Test completo
cd apps/api

# 1. Genera client
npx prisma generate

# 2. Migra database
npx prisma migrate dev --name init

# 3. Avvia backend
npm run dev

# In altro terminale:
curl http://localhost:3001/api/health

# Dovresti vedere: {"status":"ok",...}
```

---

## Comandi Utili

```bash
# Visualizza database
npx prisma studio

# Reset database (cancella tutto!)
npx prisma migrate reset

# Nuova migration
npx prisma migrate dev --name nome_migration

# Deploy migrations (production)
npx prisma migrate deploy

# Seed database
npx prisma db seed
```

---

**✅ Ora puoi sviluppare senza Docker! Il setup SQLite è perfetto per iniziare velocemente.**
