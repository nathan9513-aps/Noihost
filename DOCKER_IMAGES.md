# Noihost - Docker Images

Questo repository pubblica automaticamente le immagini Docker su GitHub Container Registry.

## Immagini Disponibili

### Backend API
```bash
docker pull ghcr.io/nathan9513-aps/noihost/api:latest
```

### Frontend Web
```bash
docker pull ghcr.io/nathan9513-aps/noihost/web:latest
```

## Eseguire Localmente con Docker

### Backend API
```bash
docker run -p 3001:3001 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e JWT_SECRET="your-secret" \
  -e NODE_ENV="production" \
  ghcr.io/nathan9513-aps/noihost/api:latest
```

### Frontend Web
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL="http://localhost:3001" \
  ghcr.io/nathan9513-aps/noihost/web:latest
```

## Deploy su Northflank

Vedi [docs/DEPLOY_NORTHFLANK.md](docs/DEPLOY_NORTHFLANK.md) per istruzioni complete.

## Build Automatizzato

Le immagini vengono costruite automaticamente ad ogni push su `main` tramite GitHub Actions.

Workflow: [.github/workflows/docker-build.yml](.github/workflows/docker-build.yml)

## Tags Disponibili

- `latest` - Ultima versione da branch main
- `main` - Branch main
- `main-<sha>` - Commit specifico

## Visibilità Immagini

Per usare le immagini su Northflank (o altri servizi), assicurati che siano pubbliche:

1. Vai su GitHub → Packages
2. Seleziona il package (noihost/api o noihost/web)
3. Package settings → Change visibility → Public

Oppure usa un Personal Access Token (PAT) per accesso privato.
