# Supabase Setup Guide

## 1. Create a Supabase Account and Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Copy your connection string from the project settings

## 2. Get Your Connection String

In Supabase project dashboard:
1. Go to **Settings** → **Database**
2. Copy the **Connection String** (URI format)
3. It will look like: `postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?schema=public`

## 3. Update `.env` File

Replace `[YOUR_PASSWORD]`, `[YOUR_HOST]`, `[YOUR_PORT]`, and `[YOUR_DB]` with your Supabase credentials:

```
PORT=3000
DATABASE_URL=postgresql://postgres.xxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?schema=public
JWT_SECRET=your-secret-key-here
```

## 4. Install Dependencies

```bash
npm install
```

## 5. Run Prisma Migrations

```bash
# Generate the Prisma client
npx prisma generate

# Run migrations to create tables
npx prisma migrate deploy

# Optional: Seed the database with initial data
npm run seed
```

## 6. Start the Server

```bash
npm run dev
```

Your backend will now connect to Supabase instead of MongoDB!

## Important Notes

- Keep your `.env` file **secret** - never commit it to version control
- The `.gitignore` already excludes `.env` files
- For production, use strong JWT secrets and secure Supabase credentials
- Supabase provides a free tier perfect for development and testing
