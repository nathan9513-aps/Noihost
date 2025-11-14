#!/bin/bash

# Script per cambiare tra SQLite (dev) e PostgreSQL (prod)

set -e

if [ "$1" == "sqlite" ]; then
    echo "🔄 Switching to SQLite (development)..."
    cp apps/api/prisma/schema.sqlite.prisma apps/api/prisma/schema.prisma
    echo "✅ Schema switched to SQLite"
    echo "📝 DATABASE_URL should be: file:./dev.db"
    
elif [ "$1" == "postgresql" ] || [ "$1" == "postgres" ]; then
    echo "🔄 Switching to PostgreSQL (production)..."
    cp apps/api/prisma/schema.postgresql.prisma apps/api/prisma/schema.prisma
    echo "✅ Schema switched to PostgreSQL"
    echo "📝 DATABASE_URL should be: postgresql://user:password@host:5432/dbname"
    
else
    echo "❌ Usage: ./switch-db.sh [sqlite|postgresql]"
    echo ""
    echo "Examples:"
    echo "  ./switch-db.sh sqlite      # Switch to SQLite for local development"
    echo "  ./switch-db.sh postgresql  # Switch to PostgreSQL for Railway/production"
    exit 1
fi

echo ""
echo "Next steps:"
echo "1. Update DATABASE_URL in apps/api/.env"
echo "2. Run: cd apps/api && npx prisma generate"
echo "3. Run: npx prisma migrate dev (for dev) or npx prisma migrate deploy (for prod)"
