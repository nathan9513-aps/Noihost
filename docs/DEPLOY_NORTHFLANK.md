# Deploy Northflank - Guida Completa

## Prerequisiti
✅ GitHub Actions configurato per build automatico delle immagini Docker
✅ Immagini Docker pubblicate su GitHub Container Registry (ghcr.io)
✅ Account Northflank (gratuito senza carta di credito per piccoli progetti)

## URL Immagini Docker
Dopo il primo push, le immagini saranno disponibili a:
- **API**: `ghcr.io/nathan9513-aps/noihost/api:latest`
- **Web**: `ghcr.io/nathan9513-aps/noihost/web:latest`

---

## PARTE 1: Setup Database PostgreSQL su Northflank

### 1. Crea Database PostgreSQL
1. Vai su [Northflank Dashboard](https://app.northflank.com)
2. Crea nuovo progetto: "Noihost Production"
3. Aggiungi servizio → **PostgreSQL Addon**
   - Nome: `noihost-postgres`
   - Version: PostgreSQL 15
   - Storage: 1GB (sufficiente per demo)
   - Piano: Starter (gratuito o low-cost)
4. Attendi che il database sia pronto (status: Running)
5. Copia la **Connection String** (formato: `postgresql://user:pass@host:5432/db`)

---

## PARTE 2: Deploy Backend API

### 1. Crea servizio Backend
1. Nuovo servizio → **Combined Service** → **External Image**
2. Configurazione base:
   - **Nome**: `noihost-api`
   - **Image**: `ghcr.io/nathan9513-aps/noihost/api:latest`
   - **Port**: `3001`
   - **Registry**: GitHub Container Registry
   - **Authentication**: Public (le tue immagini sono pubbliche per default)

### 2. Configura Variabili d'Ambiente
Vai su **Environment Variables** e aggiungi:

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db
# ⚠️ Usa la connection string del database creato al passo precedente

# Security
JWT_SECRET=super-secret-jwt-key-change-in-production
NODE_ENV=production
PORT=3001

# Optional: Stripe (se usi pagamenti)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 3. Configura Health Check
- **Health Check Path**: `/api/health`
- **Port**: `3001`
- **Initial delay**: `30s`

### 4. Risorsi (per hardware modesto)
- **CPU**: 0.2 vCPU
- **Memory**: 512MB
- **Replicas**: 1

### 5. Deploy
- Clicca **Deploy**
- Attendi il primo deploy (ci vogliono 2-3 minuti)
- Verifica logs per assicurarti che Prisma si connetta al database

---

## PARTE 3: Migrazione Database (Prima volta)

### Opzione A: Tramite Northflank Job (Consigliato)
1. Crea un **Job** temporaneo:
   - Image: `ghcr.io/nathan9513-aps/noihost/api:latest`
   - Command: `npx prisma migrate deploy`
   - Environment: stesse variabili del backend API
2. Esegui il Job
3. Verifica nei logs che la migrazione sia riuscita

### Opzione B: Da locale (alternativa)
```bash
# Nel tuo computer
cd apps/api
# Copia la DATABASE_URL di produzione in .env
DATABASE_URL="postgresql://user:pass@host:5432/db" npx prisma migrate deploy
```

---

## PARTE 4: Deploy Frontend Web

### 1. Crea servizio Frontend
1. Nuovo servizio → **Combined Service** → **External Image**
2. Configurazione:
   - **Nome**: `noihost-web`
   - **Image**: `ghcr.io/nathan9513-aps/noihost/web:latest`
   - **Port**: `3000`

### 2. Configura Variabili d'Ambiente
```bash
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://noihost-api-xxxxx.northflank.app
# ⚠️ Usa l'URL pubblico del backend API creato sopra
```

### 3. Risorse
- **CPU**: 0.2 vCPU
- **Memory**: 512MB
- **Replicas**: 1

### 4. Deploy
- Clicca **Deploy**
- Attendi completamento

---

## PARTE 5: Networking e Domini

### 1. URL Pubblici
Northflank assegna automaticamente:
- **API**: `https://noihost-api-xxxxx.northflank.app`
- **Web**: `https://noihost-web-xxxxx.northflank.app`

### 2. Domini Personalizzati (Opzionale)
1. Vai su servizio → **Networking** → **Domains**
2. Aggiungi dominio personalizzato
3. Configura DNS presso il tuo provider:
   ```
   CNAME: tuodominio.com → noihost-web-xxxxx.northflank.app
   ```
4. Northflank fornisce certificato SSL automatico

---

## PARTE 6: Aggiornamenti Automatici

### Configurazione Webhook (Opzionale)
Per re-deploy automatico quando pushi su GitHub:

1. In Northflank, vai su servizio → **CI/CD**
2. Crea webhook
3. In GitHub:
   - Repository → Settings → Webhooks
   - Aggiungi webhook con URL di Northflank
   - Eventi: `push` su branch `main`

Oppure configura auto-deploy direttamente da Northflank:
- **Auto-deploy**: Enabled
- **Registry polling**: Ogni 5 minuti
- Controlla se c'è nuova immagine `latest` e fa re-deploy automatico

---

## Verifica Deploy

### 1. Test Backend API
```bash
curl https://noihost-api-xxxxx.northflank.app/api/health
# Risposta attesa: {"status":"ok","timestamp":"..."}
```

### 2. Test Frontend
Apri browser: `https://noihost-web-xxxxx.northflank.app`
- Dovresti vedere la homepage
- Prova login/register

### 3. Test Integrazione
1. Vai su `/register` nel frontend
2. Crea un account
3. Verifica che la chiamata API funzioni
4. Controlla i logs su Northflank per debugging

---

## Troubleshooting

### ❌ API non si avvia
- Controlla logs: potrebbe mancare `DATABASE_URL`
- Verifica che il database PostgreSQL sia Running
- Assicurati di aver eseguito `prisma migrate deploy`

### ❌ Frontend non comunica con API
- Verifica `NEXT_PUBLIC_API_URL` nel frontend
- Assicurati che l'URL backend sia corretto e includa `https://`
- Controlla CORS settings nel backend (NestJS)

### ❌ Immagini Docker non trovate
- Verifica che GitHub Actions sia completato con successo
- Le immagini devono essere pubbliche su ghcr.io
- In GitHub: Settings → Packages → noihost/api → Change visibility → Public

### ❌ Database connection error
- Verifica connection string
- Assicurati che il database accetti connessioni esterne
- In Northflank, database e API devono essere nello stesso progetto

---

## Costi Stimati

### Piano Gratuito/Starter Northflank:
- **Database PostgreSQL**: Starter free tier o ~$5/mese
- **2 Servizi (API + Web)**: ~$10-15/mese per 512MB RAM ciascuno
- **Totale stimato**: $0-20/mese (dipende dall'utilizzo)

**Alternativa per risparmiare**: Usa database PostgreSQL esterno gratuito:
- [Neon.tech](https://neon.tech) - Free tier con 0.5GB
- [Supabase](https://supabase.com) - Free tier con 500MB
- [ElephantSQL](https://elephantsql.com) - Free tier con 20MB

---

## Prossimi Passi Dopo Deploy

1. ✅ Seed database con dati di test
2. ✅ Configurare variabili Stripe per pagamenti
3. ✅ Aggiungere monitoring e alerts
4. ✅ Setup backup automatici database
5. ✅ Configurare rate limiting e security headers
6. ✅ Aggiungere logging centralizzato (es: Sentry)

---

## Comandi Utili

### Re-deploy Backend
```bash
# Push su GitHub triggera automaticamente nuovo build
git push origin main
# Attendi che GitHub Actions completi
# Northflank rileva nuova immagine e fa re-deploy
```

### Logs in tempo reale
```bash
# Da Northflank Dashboard
Service → Logs → Live logs
```

### Rollback
```bash
# Da Northflank Dashboard
Service → Deployments → Seleziona versione precedente → Rollback
```

---

## Note Importanti

⚠️ **SQLite non funziona in produzione cloud** (il file database verrebbe perso ad ogni re-deploy). Usa sempre PostgreSQL in produzione.

⚠️ **Secrets**: Non committare mai JWT_SECRET o chiavi Stripe nel codice. Usa sempre variabili d'ambiente.

⚠️ **CORS**: Assicurati che il backend NestJS permetta richieste dal dominio frontend:
```typescript
// apps/api/src/main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL || 'https://noihost-web-xxxxx.northflank.app',
  credentials: true,
});
```
