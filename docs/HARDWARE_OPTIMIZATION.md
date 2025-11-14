# Ottimizzazioni per Hardware Modesti

## Modifiche Implementate

### Backend (NestJS)
1. ✅ Source maps disabilitate (risparmia memoria)
2. ✅ Incremental build abilitato
3. ✅ Skip lib check abilitato
4. ✅ Build info file configurato

### Frontend (Next.js)
1. ✅ SWC minifier abilitato
2. ✅ Ottimizzazione import automatica
3. ✅ Console.log rimossi in production
4. ✅ Tree shaking ottimizzato

### Comandi Ottimizzati

```bash
# Avvia backend con limite memoria
NODE_OPTIONS="--max-old-space-size=512" npm run dev:api

# Avvia frontend con limite memoria
NODE_OPTIONS="--max-old-space-size=1024" npm run dev:web

# Build ottimizzato
NODE_ENV=production npm run build
```

### Consigli per Hardware Modesti

1. **Avvia solo ciò che serve**
   ```bash
   # Solo backend
   npm run dev:api
   
   # Solo frontend
   npm run dev:web
   ```

2. **Usa SQLite** (già configurato)
   - Nessun server DB separato
   - Minimo uso memoria

3. **Chiudi app inutili**
   - Browser con poche tab
   - Chiudi IDE pesanti quando non servi

4. **Monitoring risorse**
   ```bash
   # Monitora uso memoria
   watch -n 1 free -h
   
   # Monitora processi Node
   ps aux | grep node
   ```

5. **Swap file** (se necessario)
   ```bash
   # Crea swap da 2GB
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

## Specifiche Minime Raccomandate

- **RAM**: 4GB (2GB dedicati a sviluppo)
- **CPU**: Dual-core 2GHz+
- **Storage**: 10GB liberi
- **OS**: Linux/macOS (più leggeri di Windows per dev)

## Troubleshooting

### "JavaScript heap out of memory"
```bash
export NODE_OPTIONS="--max-old-space-size=2048"
npm run dev
```

### Compilazione troppo lenta
```bash
# Disabilita watch mode temporaneamente
npm run build
npm run start
```

### Sistema bloccato
```bash
# Kill processi Node
pkill -f node
# Riavvia
npm run dev:api
```
