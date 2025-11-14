# ✅ Checklist Deploy Railway

## 📋 Pre-Deploy (Locale)

- [x] **Repository GitHub pushato**: `nathan9513-aps/Noihost`
- [x] **Schema PostgreSQL creato**: `apps/api/prisma/schema.postgresql.prisma`
- [x] **Script di switch DB**: `./switch-db.sh`
- [x] **Railway config files**: `railway.json`, `railway.toml`, `nixpacks.toml`
- [x] **Documentazione completa**: `docs/DEPLOY_RAILWAY.md`, `docs/DATABASE.md`

## 🚀 Deploy su Railway

### 1. Setup Account Railway (5 minuti)
- [ ] Vai su https://railway.app
- [ ] Login con GitHub
- [ ] Autorizza Railway ad accedere ai repository

### 2. Crea Progetto (2 minuti)
- [ ] Click "New Project"
- [ ] Seleziona "Deploy from GitHub repo"
- [ ] Cerca: `nathan9513-aps/Noihost`
- [ ] Click sul repository per selezionarlo

### 3. Aggiungi Database (3 minuti)
- [ ] Nel progetto, click "+ New"
- [ ] Seleziona "Database" → "PostgreSQL"
- [ ] Attendi creazione database
- [ ] Verifica tab "PostgreSQL" è apparso

### 4. Cambia Schema a PostgreSQL (2 minuti)
**IMPORTANTE: Da eseguire PRIMA del primo deploy!**

```bash
# Nel tuo terminale locale:
cd /home/nathangiovannini3/new\ project\ 1

# Cambia schema da SQLite a PostgreSQL
npm run db:switch:postgres

# Verifica cambio
grep "provider" apps/api/prisma/schema.prisma
# Dovrebbe mostrare: provider = "postgresql"

# Commit e push
git add apps/api/prisma/schema.prisma
git commit -m "chore: switch to PostgreSQL for Railway deploy"
git push origin main
```

### 5. Configura Variabili Backend (5 minuti)
Nel service **Noihost** (API):

- [ ] Click tab "Variables"
- [ ] Aggiungi: `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`
- [ ] Aggiungi: `JWT_SECRET` = `your-super-secret-jwt-key-change-this-railway-12345`
- [ ] Aggiungi: `JWT_EXPIRES_IN` = `7d`
- [ ] Aggiungi: `PORT` = `3001`
- [ ] Aggiungi: `NODE_ENV` = `production`

**Opzionali (lascia vuoto per ora):**
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `STRIPE_PLATFORM_FEE_PERCENT` = `10`
- [ ] `SENDGRID_API_KEY`
- [ ] `FROM_EMAIL`

### 6. Configura Variabili Frontend (3 minuti)
Crea nuovo service per il frontend:

- [ ] Click "+ New" nel progetto
- [ ] "Empty Service" → Nomina: `web`
- [ ] Connect to GitHub repo: `Noihost`
- [ ] Root directory: `apps/web`
- [ ] Tab "Variables":
  - [ ] `NEXT_PUBLIC_API_URL` = `https://noihost-api.railway.app` (sostituisci con URL del backend)
  - [ ] `NODE_ENV` = `production`

### 7. Configura Build Settings (5 minuti)

#### Service API (`noihost`):
- [ ] Tab "Settings"
- [ ] Build Command: `npm run build:api` *(già in railway.json)*
- [ ] Start Command: `npm run start:api` *(già in railway.json)*
- [ ] Watch Paths: `apps/api/**`

#### Service Web (`web`):
- [ ] Tab "Settings"  
- [ ] Build Command: `npm run build:web`
- [ ] Start Command: `cd apps/web && npm start`
- [ ] Watch Paths: `apps/web/**`

### 8. Deploy! (10-15 minuti)
- [ ] Railway rileverà il push e inizierà il build automaticamente
- [ ] Vai su tab "Deployments" per vedere i logs
- [ ] Attendi: "Building..." → "Deploying..." → "Success ✅"

### 9. Verifica Deploy (5 minuti)
- [ ] Click su service API → Tab "Settings" → "Generate Domain"
- [ ] Copia URL (es: `https://noihost-api.railway.app`)
- [ ] Testa: `curl https://noihost-api.railway.app/api`
- [ ] Dovrebbe rispondere: `{"message":"Welcome to Noihost API"}`
- [ ] Ripeti per service Web

### 10. Test API Endpoint (5 minuti)
```bash
# Health check
curl https://your-api.railway.app/api/health

# Register test (dopo che DB è migrato)
curl -X POST https://your-api.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "role": "HOST"
  }'
```

---

## 🔧 Troubleshooting

### ❌ Build Failed: "Schema not found"
```bash
# Locale: verifica schema è PostgreSQL
./switch-db.sh postgresql
git add apps/api/prisma/schema.prisma
git commit -m "fix: use PostgreSQL schema"
git push origin main
```

### ❌ Runtime Error: "DATABASE_URL not found"
- Vai su Railway → Service API → Tab "Variables"
- Verifica `DATABASE_URL = ${{Postgres.DATABASE_URL}}`
- Click "Restart" sul service

### ❌ Migrations Failed
Railway logs mostrano errore con migrations:
- Tab "PostgreSQL" → Connect
- Esegui manualmente: `npx prisma migrate deploy`

### ⚠️ Frontend non vede Backend
- Controlla `NEXT_PUBLIC_API_URL` nel service Web
- Deve puntare al dominio generato del backend
- Format: `https://noihost-api-production.railway.app`

### 🐛 Logs non chiari
```bash
# Locale: testa build Railway
docker run -it --rm -v $(pwd):/app -w /app node:18 bash
npm install --legacy-peer-deps
npm run build:api
```

---

## 📊 Post-Deploy

### Monitoring
- [ ] Railway Dashboard → Tab "Metrics" per vedere:
  - CPU usage
  - Memory usage
  - Network traffic
  - Crashes/restarts

### Database
- [ ] Tab "PostgreSQL" → "Data" per vedere tabelle
- [ ] Oppure connect con Prisma Studio locale:
  ```bash
  # Copia DATABASE_URL da Railway
  export DATABASE_URL="postgresql://..."
  cd apps/api
  npx prisma studio
  ```

### Custom Domain (Opzionale)
- [ ] Compra dominio (es: Namecheap, GoDaddy)
- [ ] Railway → Service → Settings → Domains
- [ ] Add Custom Domain: `www.tuodominio.com`
- [ ] Aggiungi DNS record CNAME come indicato

---

## 💰 Costi

### Free Tier Railway
- ✅ **$5 credit gratuito/mese**
- ✅ **NO carta di credito richiesta**
- Sufficiente per:
  - Backend API (sempre attivo)
  - Frontend Next.js (sempre attivo)
  - Database PostgreSQL (512MB storage)
  - ~500 ore/mese di uptime

### Se superi il free tier:
- $0.000231/GB-hr per compute
- $0.25/GB per storage database
- Stimato: ~$10-20/mese per uso moderato

---

## 🎉 Deploy Completato!

Il tuo sito è ora live su Railway! 🚀

### URL:
- **Backend API**: `https://your-api.railway.app`
- **Frontend Web**: `https://your-web.railway.app`

### Prossimi Passi:
1. Testa registrazione utente
2. Testa login
3. Inizia sviluppo Properties Module
4. Aggiungi Stripe keys quando pronto per pagamenti

---

## 📚 Risorse

- [Railway Docs](https://docs.railway.app)
- [Prisma + Railway](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-railway)
- [Next.js + Railway](https://railway.app/starters/nextjs)
- [GitHub - nathan9513-aps/Noihost](https://github.com/nathan9513-aps/Noihost)
