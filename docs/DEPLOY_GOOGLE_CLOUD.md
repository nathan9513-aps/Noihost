# Deploy su Google Cloud VM (Ubuntu)

Guida completa per installare l'immagine Docker all-in-one su una VM Ubuntu in Google Cloud Platform.

---

## 📋 Prerequisiti

- Account Google Cloud Platform
- Budget: **Free tier disponibile** (VM e2-micro gratuita)
- Carta di credito (richiesta per verifica, ma non addebitata se rimani nel free tier)

---

## PARTE 1: Creare VM su Google Cloud (10 minuti)

### 1. Accedi a Google Cloud Console

1. Vai su: https://console.cloud.google.com
2. Login con account Google
3. Crea un nuovo progetto: `Noihost`

### 2. Crea VM Ubuntu

1. Nel menu laterale → **Compute Engine** → **VM instances**
2. Clicca **Create Instance**
3. Configurazione:

```yaml
Nome: noihost-server
Regione: us-central1 (o europe-west1 per EU)
Zona: us-central1-a

Tipo macchina:
  Serie: E2
  Tipo: e2-medium (2 vCPU, 4GB RAM) ⭐ Consigliato
  # e2-small (2GB RAM) funziona ma è al limite
  # e2-micro (1GB RAM) - Free tier ma troppo poco

Boot disk:
  OS: Ubuntu
  Versione: Ubuntu 22.04 LTS
  Tipo: Balanced persistent disk
  Dimensione: 20 GB

Firewall:
  ✅ Allow HTTP traffic
  ✅ Allow HTTPS traffic
```

4. Clicca **Create**
5. Attendi 1-2 minuti per l'avvio

### 3. Configura Firewall

1. Nel menu → **VPC Network** → **Firewall**
2. **Create Firewall Rule**:

```yaml
Nome: allow-noihost-8080
Targets: All instances in the network
Source IP ranges: 0.0.0.0/0
Protocols and ports: tcp:8080
```

3. Salva

---

## PARTE 2: Installare Docker sulla VM (5 minuti)

### 1. Connettiti alla VM

Dal Google Cloud Console:
- Vai su VM instances
- Clicca **SSH** accanto alla tua VM
- Si apre un terminale nel browser

### 2. Aggiorna sistema e installa Docker

```bash
# Aggiorna sistema
sudo apt update && sudo apt upgrade -y

# Installa Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Aggiungi utente al gruppo docker
sudo usermod -aG docker $USER

# Ricarica gruppi (o esci e rientra)
newgrp docker

# Verifica installazione
docker --version
# Output: Docker version 24.x.x
```

### 3. Installa Docker Compose (opzionale ma utile)

```bash
sudo apt install docker-compose -y
docker-compose --version
```

---

## PARTE 3: Deploy Immagine All-in-One (10 minuti)

### 1. Pull immagine Docker

```bash
# Login a GitHub Container Registry (se l'immagine è pubblica, salta questo)
# echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# Pull immagine all-in-one
docker pull ghcr.io/nathan9513-aps/noihost/all-in-one:latest
```

### 2. Crea directory per persistenza

```bash
# Crea directory per database PostgreSQL
mkdir -p ~/noihost-data/postgres
chmod 777 ~/noihost-data/postgres
```

### 3. Run container

```bash
docker run -d \
  --name noihost \
  --restart unless-stopped \
  -p 8080:8080 \
  -v ~/noihost-data/postgres:/var/lib/postgresql/data \
  -e JWT_SECRET="change-this-in-production-$(openssl rand -hex 16)" \
  -e NODE_ENV="production" \
  ghcr.io/nathan9513-aps/noihost/all-in-one:latest
```

**Spiegazione parametri:**
- `-d` - Esegue in background
- `--restart unless-stopped` - Restart automatico al reboot
- `-p 8080:8080` - Espone porta 8080
- `-v ~/noihost-data/postgres:/var/lib/postgresql/data` - Persistenza database
- `-e JWT_SECRET` - Genera secret casuale per JWT
- `--name noihost` - Nome del container

### 4. Verifica container running

```bash
# Verifica container attivo
docker ps

# Vedi logs in tempo reale
docker logs -f noihost

# Dovresti vedere:
# - PostgreSQL starting...
# - Database initialized
# - Prisma migrations applied
# - Nginx started
# - API server running
# - Frontend server running
```

### 5. Test applicazione

```bash
# Prendi IP esterno della VM
curl ifconfig.me
# Output: 34.123.45.67 (esempio)

# Test health check
curl http://YOUR_VM_IP:8080/health
# Output: healthy

# Test API
curl http://YOUR_VM_IP:8080/api/health
# Output: {"status":"ok",...}
```

### 6. Apri nel browser

```
http://YOUR_VM_IP:8080
```

Dovresti vedere la homepage dell'applicazione! 🎉

---

## PARTE 4: Setup Dominio e SSL (Opzionale - 15 minuti)

### 1. Configura IP Statico

Google Cloud Console:
1. **VPC Network** → **IP addresses**
2. **Reserve External Static Address**
3. Nome: `noihost-ip`
4. Attach to: Seleziona la tua VM
5. Reserve

### 2. Configura DNS

Nel tuo provider di dominio (es: Namecheap, GoDaddy):

```
Type: A
Host: @ (o www)
Value: YOUR_STATIC_IP
TTL: 300
```

Attendi 5-30 minuti per propagazione DNS.

### 3. Installa Nginx + Certbot per SSL

```bash
# Installa Nginx e Certbot
sudo apt install nginx certbot python3-certbot-nginx -y

# Configura Nginx come reverse proxy
sudo nano /etc/nginx/sites-available/noihost

# Incolla questa configurazione:
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Abilita configurazione
sudo ln -s /etc/nginx/sites-available/noihost /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Ottieni certificato SSL gratuito
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Certbot configurerà automaticamente SSL!
```

### 4. Accedi con HTTPS

```
https://yourdomain.com
```

Ora hai SSL attivo! 🔒

---

## 🔧 Comandi Utili

### Gestione Container

```bash
# Vedere logs
docker logs -f noihost

# Restart container
docker restart noihost

# Stop container
docker stop noihost

# Start container
docker start noihost

# Rimuovere container (dati persistono nel volume)
docker rm -f noihost

# Update immagine
docker pull ghcr.io/nathan9513-aps/noihost/all-in-one:latest
docker stop noihost
docker rm noihost
# Poi riesegui docker run...
```

### Accesso Database

```bash
# Accedi al container
docker exec -it noihost sh

# Dentro il container, accedi a PostgreSQL
su-exec postgres psql -d noihost

# Query database
SELECT * FROM "User";
\q  # esci
exit  # esci dal container
```

### Backup Database

```bash
# Backup automatico
docker exec noihost su-exec postgres pg_dump noihost > backup_$(date +%Y%m%d).sql

# Restore backup
cat backup_20251115.sql | docker exec -i noihost su-exec postgres psql noihost
```

### Monitoring

```bash
# CPU e RAM usage
docker stats noihost

# Spazio disco
df -h
du -sh ~/noihost-data/postgres

# Processi nel container
docker exec noihost supervisorctl status
```

---

## 💰 Costi Google Cloud

### Free Tier (primo anno o sempre)

- **VM e2-micro**: GRATIS sempre (in certe regioni US)
  - 1 vCPU, 1GB RAM
  - 30GB storage
  - ⚠️ Troppo poco per all-in-one, ma puoi provare servizi separati

### Costi Stimati Mensili

| VM Type | vCPU | RAM | Costo/mese | Noihost? |
|---------|------|-----|------------|----------|
| e2-micro | 0.25-1 | 1GB | **$0** (free tier) | ⚠️ Troppo poco |
| e2-small | 2 | 2GB | ~$13 | ⚠️ Al limite |
| e2-medium | 2 | 4GB | ~$24 | ✅ Consigliato |
| e2-standard-2 | 2 | 8GB | ~$49 | ✅ Comodo |

**+ Storage**: ~$2/mese per 20GB

**Totale realistico**: $25-30/mese per e2-medium

💡 **Alternativa economica**: Usa servizi separati su VM e2-small ($15/mese)

---

## 📊 Monitoraggio e Manutenzione

### Setup Auto-restart al Reboot

Il container ha già `--restart unless-stopped`, ma assicurati che Docker parta al boot:

```bash
sudo systemctl enable docker
```

### Logs Rotation

```bash
# Limita dimensione logs Docker
sudo nano /etc/docker/daemon.json
```

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

```bash
sudo systemctl restart docker
docker restart noihost
```

### Alert Telegram (opzionale)

Installa script per alert quando server va down:

```bash
# Installa curl
sudo apt install curl -y

# Crea script monitor
nano ~/monitor.sh
```

```bash
#!/bin/bash
URL="http://localhost:8080/health"
TELEGRAM_BOT_TOKEN="YOUR_BOT_TOKEN"
TELEGRAM_CHAT_ID="YOUR_CHAT_ID"

if ! curl -s -f $URL > /dev/null; then
    curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
        -d chat_id=$TELEGRAM_CHAT_ID \
        -d text="⚠️ Noihost is DOWN!"
fi
```

```bash
chmod +x ~/monitor.sh

# Aggiungi a crontab (check ogni 5 min)
crontab -e
# Aggiungi: */5 * * * * /home/YOUR_USER/monitor.sh
```

---

## 🆘 Troubleshooting

### ❌ Container non parte

```bash
# Verifica logs
docker logs noihost

# Problemi comuni:
# - Porta 8080 già in uso: cambia porta -p 9090:8080
# - Out of memory: aumenta RAM VM a e2-medium
# - Permission denied su volume: chmod 777 ~/noihost-data/postgres
```

### ❌ Non raggiungibile da internet

```bash
# Verifica firewall Google Cloud
# VPC Network → Firewall → Verifica regola allow-noihost-8080

# Verifica container in ascolto
sudo netstat -tlnp | grep 8080

# Verifica IP pubblico
curl ifconfig.me
```

### ❌ Database non inizializzato

```bash
# Rimuovi volume e ricrea
docker stop noihost
sudo rm -rf ~/noihost-data/postgres/*
docker start noihost
docker logs -f noihost
# Attendi init database (~2 minuti)
```

### ❌ Out of memory

```bash
# Verifica RAM
free -h

# Se insufficiente, aggiungi swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 🔐 Sicurezza

### Hardening Base

```bash
# Aggiorna sistema regolarmente
sudo apt update && sudo apt upgrade -y

# Setup firewall UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8080/tcp
sudo ufw enable

# Cambia JWT_SECRET in produzione
docker stop noihost
docker rm noihost
# Riesegui docker run con nuovo JWT_SECRET
```

### Backup Automatici

```bash
# Script backup giornaliero
nano ~/backup-daily.sh
```

```bash
#!/bin/bash
BACKUP_DIR=~/backups
mkdir -p $BACKUP_DIR

# Backup database
docker exec noihost su-exec postgres pg_dump noihost | gzip > \
    $BACKUP_DIR/db_backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Mantieni solo ultimi 7 backup
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete
```

```bash
chmod +x ~/backup-daily.sh

# Crontab - ogni giorno alle 2am
crontab -e
# Aggiungi: 0 2 * * * /home/YOUR_USER/backup-daily.sh
```

---

## 🚀 Prossimi Passi

1. ✅ VM creata e container running
2. [ ] Configurare dominio personalizzato
3. [ ] Attivare SSL con Let's Encrypt
4. [ ] Setup backup automatici
5. [ ] Configurare monitoring
6. [ ] Implementare feature mancanti (vedi TIMELINE.md)

---

## 📚 Link Utili

- **Google Cloud Free Tier**: https://cloud.google.com/free
- **Docker Documentation**: https://docs.docker.com
- **Certbot SSL**: https://certbot.eff.org
- **Repository GitHub**: https://github.com/nathan9513-aps/Noihost

---

## Confronto Costi: Google Cloud vs Northflank

| Piattaforma | Setup | RAM | Costo/mese |
|-------------|-------|-----|------------|
| **Google Cloud e2-small** | Manuale | 2GB | ~$15 |
| **Google Cloud e2-medium** | Manuale | 4GB | ~$25 |
| **Northflank All-in-One** | Automatico | 1.5GB | $6-10 |
| **Northflank Separati** | Automatico | 1GB | $15-25 |

💡 **Consiglio**:
- **Northflank**: Più semplice, meno manutenzione, perfetto per MVP
- **Google Cloud**: Più controllo, più economico se sai gestire server

---

Buon deploy! 🚀
