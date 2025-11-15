# ✅ Checklist Deploy Northflank

## FASE 1: Preparazione (GitHub) - ⏱️ 10 minuti

- [ ] **Verifica GitHub Actions completato**
  - Vai su: https://github.com/nathan9513-aps/Noihost/actions
  - Attendi che il workflow "Build and Push Docker Images" sia ✅ verde
  - Tempo: ~5-10 minuti

- [ ] **Rendi pubblici i Docker packages**
  - Vai su: https://github.com/nathan9513-aps?tab=packages
  - Package `noihost/api`:
    - Clicca → Package settings → Change visibility → **Public** → Conferma
  - Package `noihost/web`:
    - Clicca → Package settings → Change visibility → **Public** → Conferma

- [ ] **Verifica immagini disponibili**
  ```bash
  # Questi comandi dovrebbero funzionare:
  docker pull ghcr.io/nathan9513-aps/noihost/api:latest
  docker pull ghcr.io/nathan9513-aps/noihost/web:latest
  ```

---

## FASE 2: Setup Northflank Account - ⏱️ 5 minuti

- [ ] **Crea account Northflank**
  - Vai su: https://app.northflank.com/signup
  - Sign up con GitHub (consigliato)
  - Nessuna carta richiesta per iniziare

- [ ] **Crea nuovo progetto**
  - Dashboard → New Project
  - Nome: `Noihost Production`
  - Regione: Europe (Frankfurt) o USA East

---

## FASE 3: Database PostgreSQL - ⏱️ 5 minuti

- [ ] **Crea PostgreSQL addon**
  - Nel progetto → Add Service → Addon → PostgreSQL
  - Configurazione:
    - Nome: `noihost-postgres`
    - Version: `PostgreSQL 15`
    - Storage: `1 GB` (per demo)
    - Tier: **Free** o Starter (~$5/mese)
  - Clicca **Create Addon**

- [ ] **Attendi database ready**
  - Status deve essere: 🟢 **Running**
  - Tempo: ~2-3 minuti

- [ ] **Copia connection string**
  - Vai su addon → Overview → Connection Details
  - Copia `Internal Connection URL` (formato: `postgresql://user:pass@host:5432/db`)
  - 📋 Salvala da qualche parte, serve dopo!

---

## FASE 4: Deploy Backend API - ⏱️ 10 minuti

- [ ] **Crea servizio Backend**
  - Add Service → Combined Service → External Image
  - Configurazione base:
    - **Service name**: `noihost-api`
    - **External image**: `ghcr.io/nathan9513-aps/noihost/api:latest`
    - **Port**: `3001`
    - **Dockerfile path**: (lascia vuoto per external image)

- [ ] **Configura Environment Variables**
  - Vai su servizio → Environment
  - Aggiungi variabili (clicca "Add Variable" per ognuna):
  
  ```bash
  DATABASE_URL = postgresql://user:pass@noihost-postgres:5432/db
  # ⚠️ Usa la connection string copiata prima!
  
  JWT_SECRET = super-secret-jwt-change-in-production-12345
  NODE_ENV = production
  PORT = 3001
  ```

- [ ] **Configura Health Check**
  - Health Checks → Enable health check
  - **Path**: `/api/health`
  - **Port**: `3001`
  - **Initial delay**: `30` secondi

- [ ] **Configura risorse (low-cost)**
  - Resources → CPU: `0.2 vCPU`
  - Memory: `512 MB`
  - Replicas: `1`

- [ ] **Deploy!**
  - Clicca **Deploy Service**
  - Attendi ~2-3 minuti
  - Status deve diventare: 🟢 **Healthy**

- [ ] **Verifica logs**
  - Vai su Logs
  - Cerca: `🚀 API Server running on...`
  - Se vedi errori, verifica DATABASE_URL

- [ ] **Copia URL pubblico API**
  - Vai su Networking → Public networking
  - Copia l'URL (tipo: `https://noihost-api-xxxxx.northflank.app`)
  - 📋 Salvalo, serve per il frontend!

---

## FASE 5: Migrazione Database - ⏱️ 5 minuti

- [ ] **Opzione A: Via Northflank Job (consigliato)**
  - Nel progetto → Add Service → Job
  - **Image**: `ghcr.io/nathan9513-aps/noihost/api:latest`
  - **Command**: `npx prisma migrate deploy`
  - **Environment**: Stesse variabili del backend (copia DATABASE_URL)
  - Run Job → Attendi completamento
  - Verifica logs: deve dire "Migration applied"

- [ ] **Opzione B: Da locale (alternativa)**
  ```bash
  cd apps/api
  # Usa la DATABASE_URL di produzione
  DATABASE_URL="postgresql://..." npx prisma migrate deploy
  ```

- [ ] **Verifica migrazione riuscita**
  - Vai sul database → Query console (se disponibile)
  - Oppure controlla che l'API non dia errori di DB

---

## FASE 6: Deploy Frontend Web - ⏱️ 10 minuti

- [ ] **Crea servizio Frontend**
  - Add Service → Combined Service → External Image
  - Configurazione:
    - **Service name**: `noihost-web`
    - **External image**: `ghcr.io/nathan9513-aps/noihost/web:latest`
    - **Port**: `3000`

- [ ] **Configura Environment Variables**
  ```bash
  NODE_ENV = production
  PORT = 3000
  NEXT_PUBLIC_API_URL = https://noihost-api-xxxxx.northflank.app
  # ⚠️ Usa l'URL del backend copiato prima!
  ```

- [ ] **Configura risorse**
  - CPU: `0.2 vCPU`
  - Memory: `512 MB`
  - Replicas: `1`

- [ ] **Deploy!**
  - Clicca **Deploy Service**
  - Attendi ~2-3 minuti
  - Status: 🟢 **Healthy**

- [ ] **Copia URL pubblico Web**
  - Networking → Public URL
  - Tipo: `https://noihost-web-xxxxx.northflank.app`

---

## FASE 7: Test End-to-End - ⏱️ 5 minuti

- [ ] **Test Backend API**
  ```bash
  curl https://noihost-api-xxxxx.northflank.app/api/health
  # Risposta attesa: {"status":"ok",...}
  ```

- [ ] **Test Frontend**
  - Apri browser: `https://noihost-web-xxxxx.northflank.app`
  - Dovresti vedere la homepage
  - Vai su `/register`
  - Prova a creare un account
  - Verifica che la richiesta al backend funzioni

- [ ] **Test integrazione completa**
  - Registra un nuovo utente
  - Fai login
  - Verifica che il JWT funzioni
  - Controlla i logs su Northflank per debug

---

## FASE 8: Configurazioni Finali (Opzionali) - ⏱️ 10 minuti

- [ ] **Auto-deploy da GitHub**
  - Su ogni servizio → CI/CD
  - Enable: **Auto-redeploy on new image**
  - Registry polling: `5 minutes`
  - Ora ad ogni push su GitHub, Northflank rileva le nuove immagini e fa re-deploy automatico!

- [ ] **Setup dominio personalizzato** (opzionale)
  - Service → Networking → Domains
  - Add custom domain: `tuodominio.com`
  - Configura DNS:
    ```
    CNAME: tuodominio.com → noihost-web-xxxxx.northflank.app
    ```
  - SSL certificato: automatico

- [ ] **Monitoring & Alerts** (opzionale)
  - Service → Monitoring
  - Enable alerts per:
    - CPU > 80%
    - Memory > 80%
    - Health check failures
  - Email notification

- [ ] **Backup database** (consigliato)
  - Database addon → Backups
  - Enable automatic backups
  - Frequenza: Daily

---

## 🎉 COMPLETATO!

✅ **Backend API**: `https://noihost-api-xxxxx.northflank.app`
✅ **Frontend Web**: `https://noihost-web-xxxxx.northflank.app`
✅ **Database**: PostgreSQL attivo e migrato
✅ **Auto-deploy**: Configurato da GitHub

---

## 📊 Costi Stimati

| Servizio | Risorse | Costo/mese |
|----------|---------|------------|
| PostgreSQL (1GB) | Starter | $0-5 |
| Backend API (512MB) | 0.2 vCPU | $5-8 |
| Frontend Web (512MB) | 0.2 vCPU | $5-8 |
| **TOTALE** | | **$10-20/mese** |

💡 **Tip**: Per risparmiare, usa database PostgreSQL gratuito esterno (Neon.tech, Supabase).

---

## 🆘 Troubleshooting

### ❌ GitHub Actions fallisce
- Verifica che i Dockerfile siano corretti
- Controlla logs su GitHub Actions
- Assicurati che il repository sia pubblico o che il workflow abbia permessi

### ❌ Immagini non trovate su Northflank
- Verifica che i packages su GitHub siano **pubblici**
- Prova a fare pull manuale: `docker pull ghcr.io/...`

### ❌ Backend non si avvia
- Verifica `DATABASE_URL` sia corretta
- Controlla che la migrazione sia stata eseguita
- Guarda i logs del servizio

### ❌ Frontend non comunica con backend
- Verifica `NEXT_PUBLIC_API_URL` nel frontend
- Deve includere `https://` e l'URL completo
- Controlla CORS nel backend (già configurato)

### ❌ Database connection error
- Verifica che database e API siano nello stesso progetto Northflank
- Usa `Internal Connection URL` non `External`
- Controlla username/password/host nella connection string

---

## 📚 Documentazione

- **Guida completa**: [`docs/DEPLOY_NORTHFLANK.md`](docs/DEPLOY_NORTHFLANK.md)
- **Docker images**: [`DOCKER_IMAGES.md`](DOCKER_IMAGES.md)
- **Setup locale**: [`GETTING_STARTED.md`](GETTING_STARTED.md)

---

## 🚀 Prossimi Passi

1. [ ] Seed database con dati demo
2. [ ] Configurare Stripe per pagamenti
3. [ ] Aggiungere logging (Sentry)
4. [ ] Setup monitoring avanzato
5. [ ] Implementare feature mancanti (vedi TIMELINE.md)
