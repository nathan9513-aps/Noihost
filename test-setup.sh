#!/bin/bash

echo "🧪 Testing Turno Clone Setup..."
echo ""

# Test 1: Check Node.js
echo "✓ Node.js version:"
node --version

# Test 2: Check npm
echo "✓ npm version:"
npm --version

# Test 3: Check if dependencies are installed
echo ""
echo "✓ Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "  ✓ Root dependencies installed"
fi

if [ -d "apps/api/node_modules" ]; then
    echo "  ✓ API dependencies installed"
fi

if [ -d "apps/web/node_modules" ]; then
    echo "  ✓ Web dependencies installed"
fi

# Test 4: Check database
echo ""
echo "✓ Checking database..."
if [ -f "apps/api/prisma/dev.db" ]; then
    echo "  ✓ SQLite database exists"
    echo "  ✓ Database size: $(du -h apps/api/prisma/dev.db | cut -f1)"
else
    echo "  ⚠ Database not found - run: npm run db:migrate"
fi

# Test 5: Check Prisma Client
echo ""
echo "✓ Checking Prisma Client..."
if [ -d "node_modules/@prisma/client" ]; then
    echo "  ✓ Prisma Client generated"
else
    echo "  ⚠ Prisma Client not found - run: cd apps/api && npx prisma generate"
fi

# Test 6: Check environment files
echo ""
echo "✓ Checking environment files..."
if [ -f "apps/api/.env" ]; then
    echo "  ✓ API .env exists"
else
    echo "  ⚠ API .env missing - run: cp apps/api/.env.example apps/api/.env"
fi

if [ -f "apps/web/.env" ]; then
    echo "  ✓ Web .env exists"
else
    echo "  ⚠ Web .env missing - run: cp apps/web/.env.example apps/web/.env"
fi

echo ""
echo "=========================================="
echo "📊 TEST SUMMARY"
echo "=========================================="
echo ""
echo "✅ Setup completato con successo!"
echo ""
echo "🚀 Prossimi passi:"
echo ""
echo "1. Avvia backend:"
echo "   cd apps/api && npm run dev"
echo ""
echo "2. Avvia frontend (in altro terminale):"
echo "   cd apps/web && npm run dev"
echo ""
echo "3. Apri browser:"
echo "   http://localhost:3000 (Frontend)"
echo "   http://localhost:3001/api/health (Backend)"
echo ""
echo "4. Visualizza database:"
echo "   npm run db:studio"
echo ""
