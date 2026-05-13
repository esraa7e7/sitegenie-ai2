# SiteGenie AI Platform Deployment Guide

This platform is a monorepo with a React/Vite frontend and an Express/TypeScript backend.

## Structure
- `apps/builder`: Frontend (React + Vite)
- `packages/ai-server`: Backend (Express)
- `packages/ai-core`: Shared Logic

---

## 1. Frontend Deployment (Vercel / Netlify / Cloudflare)

### Vercel
1. Support monorepos: Import the root folder.
2. Root Directory: Choose root.
3. Build Command: `npm run build --workspace=@sitegenie/builder`
4. Output Directory: `apps/builder/dist`
5. Framework Preset: `Vite`

### Netlify
Use the `netlify.toml` provided in the root. Netlify will automatically detect the settings.

### Environment Variables (Frontend)
- `VITE_API_URL`: The full URL of your deployed backend (e.g., `https://api.sitegenie.ai`).
- `VITE_SUPABASE_URL`: Your Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key.

---

## 2. Backend Deployment (Railway / Render / Heroku)

### General Instructions
1. Build Command: `npm run build` (This runs `turbo build` or `tsc` in the server package).
2. Start Command: `npm run start --workspace=@sitegenie/ai-server`
3. Port: The server listens on port `3000` by default.

### Environment Variables (Backend)
- `GEMINI_API_KEY`: Google Gemini API Key.
- `STRIPE_SECRET_KEY`: Stripe API Key.
- `DATABASE_URL`: Prisma Connection String (Postgres/Supabase).
- `REPLY_API_BASE`: (Internal) The base URL for the AI execution engine.

---

## 3. Database (Supabase / Prisma)

Before deploying the backend, ensure your database is up to date:
```bash
npx prisma generate
npx prisma db push
```

---

## 4. Production Optimizations
- Assets are configured for relative paths (`base: './'`).
- JavaScript is obfuscated on build for security.
- Sentry and PostHog are integrated for production observability.
