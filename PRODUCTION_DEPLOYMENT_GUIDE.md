# Production Deployment Guide for SiteGenie AI

This guide provides a step-by-step process for deploying the SiteGenie AI application to a production environment using Vercel.

## 1. Pre-requisites

*   **Vercel Account:** Ensure you have a Vercel account and the Vercel CLI installed (`npm i -g vercel`).
*   **Git Repository:** Your project should be connected to a Git repository (GitHub, GitLab, Bitbucket).
*   **Supabase Project:** A Supabase project with a configured PostgreSQL database.
*   **Google Cloud Project:** A Google Cloud project with the Gemini API enabled and an API key generated.
*   **Environment Variables:** All necessary environment variables defined and secured.

## 2. Vercel Project Setup

1.  **Link Project:** If not already linked, navigate to your project root and run `vercel link`. Follow the prompts to link your local project to a Vercel project.
2.  **Configure Environment Variables:**
    *   Go to your Vercel Project Settings -> Environment Variables.
    *   Add the following environment variables for both "Production" and "Preview" (and "Development" if you deploy your dev branch to Vercel):
        *   `DATABASE_URL`: Your Supabase PostgreSQL connection string. Ensure it's a `pooler` connection string for better performance and connection management.
        *   `SUPABASE_URL`: Your Supabase Project URL.
        *   `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key (found in Supabase Project Settings -> API).
        *   `SUPABASE_JWT_SECRET`: The JWT secret used by Supabase (found in Supabase Project Settings -> API).
        *   `GOOGLE_API_KEY`: Your Google Gemini API Key.
        *   `JWT_SECRET`: A strong, unique secret for your application's JWTs.
        *   `NODE_ENV`: Set to `production` for production deployments.
        *   `CORS_ORIGIN`: Set to your production frontend URL (e.g., `https://www.yourdomain.com`).
        *   `VITE_API_URL`: Set to your production backend API URL (e.g., `https://api.yourdomain.com`).
        *   `VITE_SUPABASE_URL`: Your Supabase Project URL for the frontend.
        *   `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key for the frontend.
        *   Any other environment variables specific to your application (e.g., Sentry DSN).

    *   **Secure Secrets:** Mark sensitive variables (e.g., `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_API_KEY`, `JWT_SECRET`) as "Secret" in Vercel to prevent them from being exposed in logs or build environments.

## 3. Deployment

### Via Git (Recommended)

1.  **Push to Git:** Push your changes to your configured Git repository (e.g., `git push origin main`).
2.  **Vercel Automatic Deployment:** Vercel will automatically detect the push and trigger a new deployment based on your `vercel.json` configuration and `package.json` scripts.
3.  **Monitor Deployment:** Observe the deployment logs in the Vercel dashboard for any errors or warnings.

### Via Vercel CLI

1.  **Build Locally (Optional but Recommended):** Run `npm run build:vercel` locally to ensure all build steps complete successfully.
2.  **Deploy:** From your project root, run `vercel --prod` to deploy directly to production. This will prompt you for confirmation and link the deployment to your Vercel project.

## 4. Post-Deployment Verification

After a successful deployment, perform the following checks:

*   **Access Frontend:** Navigate to your Vercel deployment URL to ensure the frontend loads correctly.
*   **Test API Endpoints:** Use a tool like Postman, Insomnia, or `curl` to test your API endpoints (e.g., `/api/health`, `/api/generate`). Verify that they return expected responses and status codes.
*   **Check Vercel Logs:** Examine the Vercel deployment and runtime logs for any errors, warnings, or unexpected behavior. Pay attention to cold start times for serverless functions.
*   **Monitor Health Checks:** Ensure that any external health monitoring tools (e.g., UptimeRobot, Pingdom) are reporting your application as healthy.
*   **Review Performance Metrics:** Check Vercel's analytics or integrated monitoring tools for performance metrics like function duration, memory usage, and response times.

## 5. Rollbacks

In case of a critical issue, you can quickly rollback to a previous successful deployment directly from the Vercel dashboard. Navigate to your project -> Deployments, select a previous successful deployment, and click "Redeploy".

## 6. Security Considerations

*   **Regular Security Audits:** Periodically review your code and dependencies for security vulnerabilities.
*   **Dependency Updates:** Keep all dependencies up-to-date to benefit from security patches.
*   **Access Control:** Implement strict access control for your Vercel project and Supabase project.
*   **API Key Rotation:** Regularly rotate your API keys (Google Gemini, Supabase).
*   **Input Validation:** Ensure all API endpoints have robust input validation to prevent injection attacks.

## 7. Troubleshooting Common Issues

*   **