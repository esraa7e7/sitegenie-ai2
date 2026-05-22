# Hugging Face Spaces Deployment Guide for SiteGenie AI

This guide outlines the steps to deploy the SiteGenie AI application to Hugging Face Spaces using the Docker SDK.

## 1. Pre-requisites

*   **Hugging Face Account:** Ensure you have a Hugging Face account.
*   **Git Repository:** Your project should be connected to a Git repository (e.g., GitHub).
*   **Environment Variables:** All necessary environment variables defined.
    *   These will be configured in your Hugging Face Space settings.
    *   Examples include `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_API_KEY`, `JWT_SECRET`, `NODE_ENV=production`, `CORS_ORIGIN`, `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

## 2. Project Setup

1.  **Dockerfile:** Ensure your project includes a `Dockerfile` configured for production (as modified in this task).
2.  **.dockerignore:** Ensure a `.dockerignore` file is present to optimize Docker builds.
3.  **Production `start` script:** Verify that your `package.json` for the `api` workspace includes a `start` script to run the backend server in production.

## 3. Deployment to Hugging Face Spaces

1.  **Create a New Space:** Go to Hugging Face Spaces and create a new Space.
    *   Choose "Docker" as the Space SDK.
    *   Link your Git repository to the Space.
2.  **Configure Environment Variables:** In your Hugging Face Space settings, navigate to "Space settings" -> "Repository secrets" and add all required environment variables.
3.  **Build and Deploy:** Hugging Face Spaces will automatically detect your `Dockerfile` and `git push` events. It will build the Docker image and deploy your application.
4.  **Monitor Deployment:** Monitor the build and deployment logs in your Hugging Face Space for any errors or warnings.

## 4. Post-Deployment Verification

After a successful deployment, perform the following checks:

*   **Access Application:** Navigate to your Hugging Face Space URL to ensure the frontend loads correctly and the backend API is accessible.
*   **Test API Endpoints:** Use a tool like Postman, Insomnia, or `curl` to test your API endpoints (e.g., `/api/health`, `/api/generate`). Verify that they return expected responses and status codes.
*   **Check Logs:** Examine the Hugging Face Space logs for any errors, warnings, or unexpected behavior.

## 5. Troubleshooting

*   **Build Failures:** Check the build logs in Hugging Face Spaces. Common issues include missing dependencies, incorrect `Dockerfile` commands, or environment variable misconfigurations.
*   **Runtime Errors:** If the application builds but fails to start or crashes, review the runtime logs in Hugging Face Spaces for error messages.
*   **Prisma Issues:** Ensure `DATABASE_URL` is correctly configured and accessible from within the Hugging Face Space. Check for any Prisma-related errors in the logs.
*   **Out of Memory:** If your Space crashes due to memory issues, consider upgrading your Space hardware or optimizing your application's memory usage.


