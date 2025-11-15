# Deploy All-in-One su Northflank

## Vantaggi dell'Immagine All-in-One

✅ **Un solo servizio** invece di 2 (risparmio 50% sui costi)
✅ **Più semplice** da configurare
✅ **Nginx incluso** come reverse proxy
✅ **Costo stimato**: $5-10/mese invece di $10-20

---

## Immagine Docker

Dopo il build GitHub Actions, l'immagine sarà disponibile su:
```
ghcr.io/nathan9513-aps/noihost/all-in-one:latest
```

---

## Deploy su Northflank - VERSIONE SEMPLIFICATA

### FASE 1: Database PostgreSQL (5 minuti)

1. Vai su https://app.northflank.com
2. Crea progetto: `Noihost Production`
3. Add Service → Addon → PostgreSQL
   - Nome: `noihost-postgres`
   - Version: PostgreSQL 15
   - Storage: 1GB
   - Tier: Free/Starter
4. Attendi che sia 🟢 Running
5. Copia `Internal Connection URL`: `postgresql://user:pass@host:5432/db`

---

### FASE 2: Deploy All-in-One (10 minuti)

1. **Crea servizio**
   - Add Service → Combined Service → External Image
   - Nome: `noihost-all-in-one`
   - Image: `ghcr.io/nathan9513-aps/noihost/all-in-one:latest`
   - Port: `8080` ⚠️ (non 3000 o 3001!)

2. **Environment Variables**
   ```bash
   # Database
   DATABASE_URL=postgresql://user:pass@noihost-postgres:5432/db
   
   # Security
   JWT_SECRET=super-secret-jwt-change-in-production-12345
   NODE_ENV=production
   
   # Frontend API URL (interno)
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Health Check**
   - Path: `/health`
   - Port: `8080`
   - Initial delay: 30 secondi

4. **Risorse**
   - CPU: 0.2-0.5 vCPU
   - Memory: 1GB (serve più RAM perché gira tutto insieme)
   - Replicas: 1

5. **Deploy!**
   - Clicca Deploy
   - Attendi 3-5 minuti
   - Status: 🟢 Healthy

---

### FASE 3: Migrazione Database (5 minuti)

**Via Northflank Job:**
1. Add Service → Job
2. Image: `ghcr.io/nathan9513-aps/noihost/all-in-one:latest`
3. Command: `sh -c "cd /app/api && npx prisma migrate deploy"`
4. Environment: Stesse variabili (DATABASE_URL, etc.)
5. Run Job
6. Verifica logs: "Migration applied"

**Alternativa da locale:**
```bash
cd apps/api
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

---

### FASE 4: Test (2 minuti)

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

## Architettura All-in-One

```
┌─────────────────────────────────────────┐
│  Docker Container (Port 8080)           │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Nginx (Reverse Proxy)          │   │
│  │  - Route / → Frontend (3000)    │   │
│  │  - Route /api → Backend (3001)  │   │
│  └─────────────────────────────────┘   │
│           │                   │         │
│           │                   │         │
│  ┌────────▼─────┐    ┌───────▼──────┐  │
│  │ Next.js      │    │ NestJS API   │  │
│  │ Frontend     │    │ Backend      │  │
│  │ (Port 3000)  │    │ (Port 3001)  │  │
│  └──────────────┘    └──────────────┘  │
│                                         │
│  Supervisor (gestisce tutti i processi) │
└─────────────────────────────────────────┘
           │
           │ PostgreSQL Connection
           ▼
   ┌──────────────────┐
   │  PostgreSQL DB   │
   │  (Addon)         │
   └──────────────────┘
```

---

## Costi Stimati

| Servizio | Risorse | Costo/mese |
|----------|---------|------------|
| PostgreSQL (1GB) | Starter | $0-5 |
| All-in-One (1GB RAM) | 0.5 vCPU | $5-10 |
| **TOTALE** | | **$5-15/mese** |

💰 **Risparmio: 50%** rispetto a 2 servizi separati!

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

### ❌ Out of memory
- Aumenta RAM a 1.5GB o 2GB
- All-in-one richiede più memoria perché esegue tutto insieme

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

| Feature | All-in-One | Separati (2 servizi) |
|---------|------------|----------------------|
| **Costo** | $5-15/mese | $10-20/mese |
| **RAM necessaria** | 1GB | 512MB x 2 |
| **Complessità** | Bassa | Media |
| **Scaling** | Verticale | Orizzontale |
| **Fault tolerance** | Bassa | Alta |
| **Best for** | Demo, MVP | Produzione |

---

## Quando usare All-in-One?

✅ **Usa All-in-One se:**
- Stai facendo demo o MVP
- Budget limitato
- Traffico basso/medio
- Deployment semplice

❌ **Usa servizi separati se:**
- Produzione con traffico alto
- Serve high availability
- Vuoi scaling indipendente frontend/backend
- Budget non è un problema

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
