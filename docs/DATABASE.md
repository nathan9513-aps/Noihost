# 🗄️ Database Management - SQLite & PostgreSQL

## 📁 File Schema Disponibili

Il progetto mantiene 3 versioni dello schema Prisma:

- **`schema.prisma`** - Schema ATTIVO usato da Prisma Client (NON modificare direttamente)
- **`schema.sqlite.prisma`** - Schema per sviluppo locale con SQLite
- **`schema.postgresql.prisma`** - Schema per produzione Railway con PostgreSQL

## 🔄 Switch tra Database

### Sviluppo Locale (SQLite)
```bash
# Cambia a SQLite
./switch-db.sh sqlite

# Rigenera Prisma Client
cd apps/api
npx prisma generate

# Crea/applica migrations
npx prisma migrate dev --name init
```

### Produzione Railway (PostgreSQL)
```bash
# Cambia a PostgreSQL
./switch-db.sh postgresql

# Rigenera Prisma Client
cd apps/api
npx prisma generate

# Deploy migrations (su Railway verrà fatto automaticamente)
# npx prisma migrate deploy
```

## 📊 Differenze tra SQLite e PostgreSQL

### SQLite (Sviluppo)
- ✅ **Vantaggi**:
  - Zero configurazione
  - File singolo (132KB)
  - Veloce per sviluppo
  - No server necessario
  
- ❌ **Limitazioni**:
  - No enum nativi → usa String
  - No array nativi → usa String con JSON
  - Concorrenza limitata
  - Non adatto a produzione

### PostgreSQL (Produzione)
- ✅ **Vantaggi**:
  - Enum nativi supportati
  - Array PostgreSQL nativi
  - Concorrenza robusta
  - Scalabilità enterprise
  - Transazioni ACID complete
  
- ⚠️ **Requisiti**:
  - Server PostgreSQL necessario
  - Più complesso da configurare
  - Railway lo fornisce gratis

## 🔧 Modificare lo Schema

### Se devi modificare il database:

1. **Modifica ENTRAMBI i file**:
   - `apps/api/prisma/schema.sqlite.prisma`
   - `apps/api/prisma/schema.postgresql.prisma`

2. **Per SQLite, converti**:
   - Enum → String con commenti
   - Array → String (salva come JSON)
   
3. **Esempio di conversione**:

```prisma
// PostgreSQL (schema.postgresql.prisma)
enum UserRole {
  HOST
  CLEANER
  ADMIN
}

model User {
  role UserRole
  tags String[] // PostgreSQL array nativo
}

// SQLite (schema.sqlite.prisma)
// Enum convertito: HOST | CLEANER | ADMIN
model User {
  role String // "HOST" | "CLEANER" | "ADMIN"
  tags String // JSON stringificato: '["tag1","tag2"]'
}
```

4. **Testa entrambe le versioni**:

```bash
# Testa SQLite
./switch-db.sh sqlite
cd apps/api && npx prisma migrate dev

# Testa PostgreSQL (se hai Docker)
./switch-db.sh postgresql
# Aggiorna DATABASE_URL a postgres locale
npx prisma migrate dev
```

5. **Commit entrambi i file**:
```bash
git add apps/api/prisma/schema.*.prisma
git commit -m "feat: add NewFeature to schema (SQLite + PostgreSQL)"
```

## 🚨 IMPORTANTE

### ⚠️ NON modificare `schema.prisma` direttamente!
È un file generato automaticamente dallo script `switch-db.sh`.

### ✅ Workflow corretto:
1. Modifica `schema.sqlite.prisma` + `schema.postgresql.prisma`
2. Esegui `./switch-db.sh [sqlite|postgresql]`
3. Rigenera Prisma Client: `npx prisma generate`
4. Crea migration: `npx prisma migrate dev`

## 📝 Comandi Utili

```bash
# Visualizza schema attivo
cat apps/api/prisma/schema.prisma | head -20

# Vedi quale database stai usando
grep "provider" apps/api/prisma/schema.prisma

# Apri Prisma Studio (funziona con entrambi)
npm run db:studio

# Resetta database (ATTENZIONE: cancella tutti i dati!)
cd apps/api
npx prisma migrate reset
```

## 🌐 Workflow Completo (Dev → Prod)

### 1️⃣ Sviluppo Locale (SQLite)
```bash
./switch-db.sh sqlite
cd apps/api
npx prisma migrate dev --name add_feature_x
```

### 2️⃣ Test Feature
```bash
npm run dev:api
# Testa la nuova feature...
```

### 3️⃣ Prepara per Railway (PostgreSQL)
```bash
./switch-db.sh postgresql
git add apps/api/prisma/schema.prisma
git commit -m "chore: switch to PostgreSQL for deploy"
git push origin main
```

### 4️⃣ Deploy su Railway
Railway rileverà il push e:
- Eseguirà `npm install`
- Eseguirà `npx prisma generate`
- Eseguirà `npx prisma migrate deploy`
- Avvierà il server

## 🐛 Troubleshooting

### Errore: "Schema not found"
```bash
# Rigenera schema attivo
./switch-db.sh sqlite  # o postgresql
cd apps/api && npx prisma generate
```

### Errore: "Enum not supported in SQLite"
Verifica di aver eseguito `./switch-db.sh sqlite` prima di fare migrate con SQLite.

### Prisma Client non aggiornato
```bash
cd apps/api
npx prisma generate --force
```

### Migration non applicate
```bash
# Development
npx prisma migrate dev

# Production (Railway)
npx prisma migrate deploy
```

## 📚 Risorse

- [Prisma Docs - SQLite](https://www.prisma.io/docs/concepts/database-connectors/sqlite)
- [Prisma Docs - PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Railway Docs - Databases](https://docs.railway.app/databases)
