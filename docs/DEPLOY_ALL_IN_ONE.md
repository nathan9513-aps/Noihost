# Deploy All-in-One su Northflank

## Vantaggi dell'Immagine All-in-One

✅ **Database PostgreSQL integrato** - Zero setup esterno!
✅ **Un solo servizio** invece di 2+ (risparmio 60-70% sui costi)
✅ **Completamente self-contained** - Tutto in un container
✅ **Più semplice** da configurare (nessun addon esterno)
✅ **Nginx incluso** come reverse proxy
✅ **Costo stimato**: $5-8/mese invece di $15-25

---

## Immagine Docker

Dopo il build GitHub Actions, l'immagine sarà disponibile su:
```
ghcr.io/nathan9513-aps/noihost/all-in-one:latest
```

**Include:**
- PostgreSQL 15 (database)
- NestJS Backend (API)
- Next.js Frontend (web)
- Nginx (reverse proxy)
- Supervisor (process manager)

---

## Deploy su Northflank - VERSIONE ULTRA-SEMPLIFICATA

### Deploy All-in-One (15 minuti totali!)

1. **Crea servizio**
   - Vai su https://app.northflank.com
   - Crea progetto: `Noihost Production`
   - Add Service → Combined Service → External Image
   - Nome: `noihost-complete`
   - Image: `ghcr.io/nathan9513-aps/noihost/all-in-one:latest`
   - Port: `8080` ⚠️

2. **Environment Variables** (opzionali, hanno già defaults)
   ```bash
   # Security (opzionale, cambia in produzione)
   JWT_SECRET=super-secret-jwt-change-in-production-12345
   NODE_ENV=production
   
   # Database è già configurato internamente!
   # DATABASE_URL è già settato a postgresql://postgres:postgres@localhost:5432/noihost
   ```

3. **Storage (IMPORTANTE per persistenza database!)**
   - Vai su Storage → Add Volume
   - Mount path: `/var/lib/postgresql/data`
   - Size: 2GB (minimo per database)
   - ⚠️ Senza questo, i dati si perdono al restart!

4. **Health Check**
   - Path: `/health`
   - Port: `8080`
   - Initial delay: 60 secondi (serve più tempo per PostgreSQL)

5. **Risorse**
   - CPU: 0.5 vCPU (serve più per PostgreSQL)
   - Memory: 1.5GB (PostgreSQL + API + Web)
   - Replicas: 1

6. **Deploy!**
   - Clicca Deploy
   - Attendi 5-7 minuti (prima volta serve più tempo per init PostgreSQL)
   - Status: 🟢 Healthy

---

## ✅ DONE! Nessun altro setup necessario

Il database è già:
- ✅ Inizializzato automaticamente
- ✅ Migrations eseguite al primo avvio
- ✅ Pronto per l'uso

---

1. **Copia URL pubblico**
   - Networking → Public URL
   - Esempio: `https://noihost-all-in-one-xxxxx.northflank.app`

2. **Test health check**
   ```bash
   curl https://noihost-all-in-one-xxxxx.northflank.app/health
   # Risposta: healthy
   ```

3. **Test API**
   ```bash
   curl https://noihost-all-in-one-xxxxx.northflank.app/api/health
   # Risposta: {"status":"ok",...}
   ```

4. **Test Frontend**
   - Apri browser: `https://noihost-all-in-one-xxxxx.northflank.app`
   - Dovresti vedere la homepage
   - Prova `/register` e `/login`

---

## Architettura All-in-One con Database

```
┌──────────────────────────────────────────────────────┐
│  Docker Container (Port 8080)                        │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │  Nginx (Reverse Proxy)                         │ │
│  │  - Route / → Frontend (3000)                   │ │
│  │  - Route /api → Backend (3001)                 │ │
│  └────────────────────────────────────────────────┘ │
│           │                   │                      │
│           │                   │                      │
│  ┌────────▼─────┐    ┌───────▼──────┐              │
│  │ Next.js      │    │ NestJS API   │              │
│  │ Frontend     │    │ Backend      │              │
│  │ (Port 3000)  │    │ (Port 3001)  │              │
│  └──────────────┘    └───────┬──────┘              │
│                              │                       │
│                              │ localhost:5432        │
│                              ▼                       │
│                      ┌──────────────┐               │
│                      │ PostgreSQL   │               │
│                      │ Database     │               │
│                      │ (Port 5432)  │               │
│                      └──────────────┘               │
│                                                      │
│  Supervisor (gestisce tutti i 4 processi)           │
│  - postgresql, nginx, api, web                      │
└──────────────────────────────────────────────────────┘
              │
              │ Volume Mount
              ▼
   ┌──────────────────────┐
   │  Persistent Storage  │
   │  /var/lib/postgresql │
   └──────────────────────┘
```

---

## Costi Stimati

| Servizio | Risorse | Costo/mese |
|----------|---------|------------|
| All-in-One + DB (1.5GB RAM) | 0.5 vCPU | $5-8 |
| Storage (2GB) | Persistent | $1-2 |
| **TOTALE** | | **$6-10/mese** |

💰 **Risparmio: 60-70%** rispetto a servizi separati + database addon!

**Confronto costi:**
- All-in-One con DB: **$6-10/mese**
- Servizi separati + DB addon: **$15-25/mese**

---

## Troubleshooting

### ❌ Container non parte
- Aumenta RAM a 1GB o 1.5GB
- Verifica DATABASE_URL
- Controlla logs per errori Prisma

### ❌ Nginx non risponde
- Verifica porta sia 8080 (non 3000/3001)
- Health check deve puntare a /health

### ❌ Frontend o Backend non raggiungibile
- Controlla logs Supervisor
- Verifica che tutti e 3 i processi siano running (nginx, api, web)

### ❌ Database non inizializzato
- Verifica volume montato su `/var/lib/postgresql/data`
- Controlla logs PostgreSQL: `supervisorctl tail postgresql`
- Prima volta richiede 1-2 minuti per init

### ❌ Migrations non applicate
- Alla prima startup le migrations sono automatiche
- Se falliscono, esegui manualmente: 
  ```bash
  # Accedi al container
  cd /app/api
  npx prisma migrate deploy
  ```

### ❌ Out of memory
- Aumenta RAM a 2GB
- PostgreSQL + Backend + Frontend insieme richiedono ~1.5GB minimo

---

## Auto-Deploy

1. Service → CI/CD
2. Enable: **Auto-redeploy on new image**
3. Registry polling: 5 minutes
4. Ad ogni push su GitHub, re-deploy automatico! 🚀

---

## Comandi Utili

### Logs in tempo reale
```bash
# Da Northflank Dashboard
Service → Logs → Live logs
```

### Restart servizio
```bash
# Da Northflank Dashboard
Service → Actions → Restart
```

### Debug processi interni
```bash
# Se hai accesso shell al container
supervisorctl status
# Mostra stato di nginx, api, web
```

---

## Confronto: All-in-One vs Separati

| Feature | All-in-One + DB | Separati (3 servizi) |
|---------|-----------------|----------------------|
| **Costo** | $6-10/mese | $15-25/mese |
| **RAM necessaria** | 1.5-2GB | 512MB x 2 + DB |
| **Setup** | 1 servizio | 3 servizi |
| **Database** | Integrato | Addon separato |
| **Complessità** | Molto bassa | Media-alta |
| **Scaling** | Verticale | Orizzontale |
| **Fault tolerance** | Bassa | Alta |
| **Persistenza** | Volume required | Addon managed |
| **Best for** | Demo, MVP, piccoli progetti | Produzione, high traffic |

---

## Quando usare All-in-One con DB?

✅ **Usa All-in-One + DB se:**
- Stai facendo demo, proof-of-concept o MVP
- Budget molto limitato ($6-10/mese)
- Traffico basso (< 100 utenti)
- Deploy veloce e semplice
- Non serve high availability

❌ **Usa servizi separati se:**
- Produzione con traffico alto
- Serve high availability (99.9%+)
- Database con backup automatici gestiti
- Budget non è problema principale
- Team che gestisce infrastruttura

---

## Prossimi Passi

1. ✅ Deploy completato
2. [ ] Configurare dominio personalizzato
3. [ ] Setup backup database automatici
4. [ ] Aggiungere monitoring (Sentry, LogDNA)
5. [ ] Seed database con dati demo
6. [ ] Implementare feature mancanti

---

## Link Utili

- **Guida servizi separati**: [`docs/DEPLOY_NORTHFLANK.md`](DEPLOY_NORTHFLANK.md)
- **Docker images**: [`DOCKER_IMAGES.md`](../DOCKER_IMAGES.md)
- **Setup locale**: [`GETTING_STARTED.md`](../GETTING_STARTED.md)
