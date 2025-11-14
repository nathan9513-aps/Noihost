# 🚂 DEPLOY SU RAILWAY - Guida Completa

## 📋 Prerequisiti
- ✅ Account GitHub
- ✅ Repository Noihost pushato su GitHub
- ❌ NO carta di credito richiesta!

---

## 🚀 DEPLOY AUTOMATICO (Consigliato)

### Step 1: Crea Account Railway
1. Vai su: https://railway.app
2. Click "Login" → Login con GitHub
3. Autorizza Railway ad accedere ai tuoi repository

### Step 2: Crea Nuovo Progetto
1. Click "New Project"
2. Seleziona "Deploy from GitHub repo"
3. Cerca e seleziona: `nathan9513-aps/Noihost`
4. Click su repository per selezionarlo

### Step 3: Configura Database (PostgreSQL)
1. Nel progetto, click "+ New"
2. Seleziona "Database" → "PostgreSQL"
3. Railway creerà automaticamente il database
4. Copia la `DATABASE_URL` (sarà simile a: `postgresql://...`)

### Step 3.5: Prepara il Codice per PostgreSQL
Prima del deploy, esegui localmente:

```bash
# Cambia schema da SQLite a PostgreSQL
./switch-db.sh postgresql

# Verifica che schema.prisma ora usi PostgreSQL
cat apps/api/prisma/schema.prisma | head -10

# Commit il cambio
git add apps/api/prisma/schema.prisma
git commit -m "chore: switch to PostgreSQL for Railway"
git push origin main
```

### Step 4: Configura Variabili Ambiente - Backend

Nel service **Noihost**:
1. Vai su tab "Variables"
2. Aggiungi queste variabili:

```env
# Database (copia dalla tab del PostgreSQL)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-railway-12345
JWT_EXPIRES_IN=7d

# Stripe (lascia vuoto per ora o aggiungi se hai le chiavi)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PLATFORM_FEE_PERCENT=10

# Email (opzionale)
SENDGRID_API_KEY=
FROM_EMAIL=noreply@noihost.app

# App
NODE_ENV=production
PORT=3001

# Frontend URL (Railway lo genererà - aggiorna dopo primo deploy)
FRONTEND_URL=https://noihost-production.up.railway.app
```

### Step 5: Configura Settings
1. Tab "Settings"
2. **Root Directory**: lascia vuoto `/`
3. **Build Command**: 
   ```bash
   npm install --legacy-peer-deps && cd apps/api && npx prisma generate && cd ../.. && npm run build:api
   ```
4. **Start Command**:
   ```bash
   cd apps/api && npx prisma migrate deploy && npm run start:prod
   ```
5. **Watch Paths**: `apps/api/**`

### Step 6: Deploy!
1. Click "Deploy" in alto a destra
2. Attendi 3-5 minuti per il primo deploy
3. Railway mostrerà i logs in tempo reale
4. Una volta completato vedrai "✓ Build successful"

### Step 7: Aggiungi Frontend (Opzionale - Servizio Separato)
1. Nel progetto click "+ New" → "GitHub Repo"
2. Seleziona di nuovo `Noihost`
3. Nelle Settings:
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm install --legacy-peer-deps && npm run build`
   - **Start Command**: `npm run start`
4. Variables:
   ```env
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://[tuo-backend-url].railway.app/api
   ```

---

## 🌐 URL Generati

Dopo il deploy avrai:
- **Backend API**: `https://noihost-production.up.railway.app`
- **Frontend** (se deployato separatamente): `https://noihost-web-production.up.railway.app`

Puoi testare:
- API Health: `https://[backend-url]/api/health`
- Frontend: `https://[frontend-url]`

---

## ⚙️ CONFIGURAZIONE AUTOMATICA

Railway userà i files che ho creato:
- ✅ `railway.json` - Configurazione build
- ✅ `railway.toml` - Multi-service config
- ✅ `nixpacks.toml` - Build settings

---

## 🔄 DEPLOY AUTOMATICI

✅ Ogni push su `main` trigghererà un deploy automatico!

```bash
# Sul tuo PC
git add .
git commit -m "feat: nuova feature"
git push origin main

# Railway farà deploy automaticamente!
```

---

## 💾 DATABASE POSTGRESQL

Railway ti da GRATIS:
- ✅ 500 MB storage
- ✅ Backup automatici
- ✅ Connection pooling
- ✅ SSL incluso

### Migrazione da SQLite a PostgreSQL

Il tuo schema Prisma dovrà essere aggiornato:

1. **Cambia datasource in `apps/api/prisma/schema.prisma`**:
```prisma
datasource db {
  provider = "postgresql"  // invece di "sqlite"
  url      = env("DATABASE_URL")
}
```

2. **Riconverti gli enum** (PostgreSQL li supporta):
```prisma
enum UserRole {
  HOST
  CLEANER
  ADMIN
}
// Usa UserRole invece di String nei models
```

3. **Railway eseguirà automaticamente**:
```bash
npx prisma migrate deploy
```

---

## 🐛 TROUBLESHOOTING

### Build Failed
**Errore**: "Module not found"
**Fix**: Verifica che `npm install --legacy-peer-deps` sia nel build command

### Database Connection Failed
**Errore**: "Can't reach database"
**Fix**: 
1. Verifica che `DATABASE_URL` sia configurata
2. Usa `${{Postgres.DATABASE_URL}}` per riferimento interno

### Port Already in Use
**Fix**: Railway gestisce automaticamente le porte, non serve specificare

### Out of Memory
**Fix**: Railway ha 8GB RAM gratis. Se serve più memoria:
1. Ottimizza il build
2. Usa `NODE_OPTIONS=--max-old-space-size=4096`

---

## 💰 COSTI

✅ **Tier Gratuito Railway**:
- $5 credito gratis/mese
- ~500 ore runtime
- Database PostgreSQL incluso
- SSL automatico
- Custom domains (limitati)

⚠️ **Nota**: Dopo aver esaurito $5:
- App va in sleep dopo inattività
- Oppure upgrade a paid plan

---

## 📊 MONITORING

Railway Dashboard mostra:
- ✅ CPU usage
- ✅ Memory usage
- ✅ Request count
- ✅ Response times
- ✅ Logs in tempo reale

---

## 🔐 CUSTOM DOMAIN (Opzionale)

Se hai un dominio:
1. Tab "Settings" del service
2. "Domains" → "Custom Domain"
3. Aggiungi: `api.tuodominio.com`
4. Configura DNS:
   ```
   Type: CNAME
   Name: api
   Value: [railway-url].up.railway.app
   ```

---

## ✅ CHECKLIST DEPLOY

Prima del deploy verifica:
- [ ] Repository pushato su GitHub
- [ ] `apps/api/prisma/schema.prisma` usa `postgresql`
- [ ] Variabili ambiente configurate
- [ ] Build commands corretti
- [ ] `.env` files in `.gitignore`

---

## 🚀 DEPLOY RAPIDO (TL;DR)

```bash
1. Vai su railway.app
2. Login con GitHub
3. New Project → Deploy from GitHub → Seleziona Noihost
4. Aggiungi PostgreSQL database (+ New → Database)
5. Configura variabili (DATABASE_URL, JWT_SECRET, etc.)
6. Deploy!
```

**Tempo totale: ~10 minuti**

---

**Una volta deployato, aggiorna questo README con i tuoi URL live!** 🎉
