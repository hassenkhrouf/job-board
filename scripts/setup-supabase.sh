#!/bin/bash

# Script to set up Supabase database for Job Board project
# Run this script locally after cloning the repo

echo "🚀 Setting up Job Board database on Supabase..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set."
    echo "Please export it first:"
    echo 'export DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"'
    exit 1
fi

echo "✅ DATABASE_URL is set"

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

# Apply migrations
echo "🗄️  Applying migrations to Supabase..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo "✅ Migrations applied successfully!"
else
    echo "❌ Failed to apply migrations. Please check your DATABASE_URL and try again."
    exit 1
fi

# Seed database
echo "🌱 Seeding database with initial data..."
npx prisma db seed

if [ $? -eq 0 ]; then
    echo "✅ Database seeded successfully!"
else
    echo "⚠️  Seeding failed, but migrations were applied. You can seed manually later."
fi

echo ""
echo "🎉 Setup complete!"
echo "Your Job Board is ready to use."
echo ""
echo "Admin login:"
echo "  Email: admin@jobboard.tn"
echo "  Password: admin123"
echo ""
echo "Next steps:"
echo "1. Push code to GitHub"
echo "2. Deploy to Vercel with DATABASE_URL environment variable"
echo "3. Connect your custom domain"
