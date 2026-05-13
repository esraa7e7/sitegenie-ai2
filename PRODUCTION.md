# Production Deployment Guide - SiteGenie AI

This guide outlines the steps to deploy the SiteGenie AI platform to production.

## 1. Backend Deployment (Railway)

The backend is configured via `railway.json` and root `package.json`.

### Steps:
1. Push this repository to GitHub.
2. Sign in to [Railway.app](https://railway.app).
3. Create a **New Project** and select your GitHub repository.
4. Add a **Redis** service (required for rate limiting).
5. In the **AI Server** service settings, add the following variables:
   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `REDIS_URL`: Link to your Railway Redis service.
   - `ALLOWED_ORIGINS`: Your Netlify frontend URL (once deployed).
   - `SUPABASE_SERVICE_ROLE_KEY`: If using Supabase for server-side operations.
   - `SENTRY_DSN`: Your Sentry DSN for error tracking.

## 2. Frontend Deployment (Netlify)

The frontend is configured via `apps/builder/netlify.toml`.

### Steps:
1. Sign in to [Netlify](https://netlify.com).
2. Create a **New Site from Git**.
3. Select this repository.
4. Set the **Base Directory** to `apps/builder`.
5. Set the **Build Command** to `npm run build --filter=@sitegenie/builder`.
6. Set the **Publish Directory** to `dist`.
7. Add the following **Environment Variables**:
   - `VITE_API_URL`: The URL of your Railway backend.
   - `VITE_SENTRY_DSN`: Your Sentry DSN for frontend tracking.
   - `VITE_SUPABASE_URL`: Your Supabase Project URL.
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key.

## 3. Security Checklist

- [ ] Rate limiting is active (via Redis).
- [ ] API keys are removed from frontend code.
- [ ] CORS is restricted to production domains.
- [ ] Sentry is capturing errors on both client and server.
- [ ] SPA routing is handled by `netlify.toml`.
- [ ] Security headers are provided by Helmet and Netlify.

## 4. Monitoring & Maintenance

- Use the Railway dashboard to monitor server logs and Redis usage.
- Use Sentry to track real-time crashes and performance bottlenecks.
- Use PostHog (if integrated) for user analytics.
