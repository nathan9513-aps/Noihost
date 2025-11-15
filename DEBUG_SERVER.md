# Debug Server Issues

## Comandi per verificare il server remoto (136.111.249.191:8080)

### 1. Verificare lo stato del container
```bash
ssh root@136.111.249.191 "docker ps -a | grep noihost"
```

### 2. Vedere i log del container
```bash
ssh root@136.111.249.191 "docker logs noihost-app --tail 100"
```

### 3. Verificare le porte aperte
```bash
ssh root@136.111.249.191 "netstat -tulpn | grep -E '3000|3001|8080'"
```

### 4. Testare l'endpoint API direttamente dal server
```bash
ssh root@136.111.249.191 "curl -X POST http://localhost:3001/api/auth/register -H 'Content-Type: application/json' -d '{\"email\":\"test@test.com\",\"password\":\"test123\",\"firstName\":\"Test\",\"lastName\":\"User\",\"role\":\"HOST\"}'"
```

### 5. Verificare le variabili d'ambiente del container
```bash
ssh root@136.111.249.191 "docker exec noihost-app env | grep -E 'DATABASE_URL|JWT_SECRET|NEXT_PUBLIC'"
```

### 6. Entrare nel container per debugging
```bash
ssh root@136.111.249.191 "docker exec -it noihost-app sh"
```

## Possibili Cause del "Failed to fetch"

### 1. Backend non in esecuzione
- Verifica: `docker logs noihost-app | grep "Nest application successfully started"`
- Fix: Riavviare il container

### 2. CORS non configurato correttamente
- Il backend deve accettare richieste dal frontend
- Verificare `apps/api/src/main.ts` ha `app.enableCors()`

### 3. URL API non corretto
- Frontend cerca API su: `http://localhost:3001/api`
- Ma sul server dovrebbe essere: `http://136.111.249.191:3001/api` o interno al container

### 4. Database non inizializzato
- Verifica: `docker exec noihost-app ls -la prisma/dev.db`
- Fix: Eseguire migrations nel container

### 5. Variabili d'ambiente mancanti
- JWT_SECRET non configurato
- DATABASE_URL non corretto

## Fix Rapidi

### Riavviare il container
```bash
ssh root@136.111.249.191 "docker restart noihost-app"
```

### Ricreare il container con env corretti
```bash
ssh root@136.111.249.191 "docker stop noihost-app && docker rm noihost-app"
ssh root@136.111.249.191 "docker run -d --name noihost-app -p 8080:3000 -p 3001:3001 -e DATABASE_URL='file:./dev.db' -e JWT_SECRET='your-secret-key-here' -e NEXT_PUBLIC_API_URL='http://136.111.249.191:3001/api' ghcr.io/nathan9513-aps/noihost/all-in-one:latest"
```

### Aggiornare l'immagine Docker
```bash
ssh root@136.111.249.191 "docker pull ghcr.io/nathan9513-aps/noihost/all-in-one:latest && docker stop noihost-app && docker rm noihost-app && docker run -d --name noihost-app -p 8080:3000 -p 3001:3001 -e DATABASE_URL='file:./dev.db' -e JWT_SECRET='your-secret-key-here' -e NEXT_PUBLIC_API_URL='http://136.111.249.191:3001/api' ghcr.io/nathan9513-aps/noihost/all-in-one:latest"
```

## URL Corretti per il Server Remoto

### Frontend (Browser)
- Accedi a: `http://136.111.249.191:8080`

### API (Backend)
- Endpoint: `http://136.111.249.191:3001/api`
- Test health: `curl http://136.111.249.191:3001/api/health`

### Configurazione NEXT_PUBLIC_API_URL
Nel container deve essere:
```env
NEXT_PUBLIC_API_URL=http://136.111.249.191:3001/api
```
