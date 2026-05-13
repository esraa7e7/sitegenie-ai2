# 🚀 Render Deployment Guide - SiteGenie AI

This project is optimized for **One-Click Deployment** using Render's "Blueprint" feature.

## 1. Prepare Your Code
1. Create a new repository on **GitHub**.
2. Upload all the files in this project to your repository.
   - *Tip: Ensure `.gitignore` is present so you don't upload unnecessary `node_modules`.*

## 2. Connect to Render
1. Log in to [Render.com](https://render.com).
2. Click the **"New +"** button (top right).
3. Select **"Blueprint"** from the menu.
4. Connect your GitHub account and select your **SiteGenie AI** repository.

## 3. Configuration (The "Blueprint" Screen)
Render will automatically read the `render.yaml` file. You will see two services:
- **sitegenie-api**: The brain (Backend).
- **sitegenie-frontend**: The interface (Frontend).

### Important: Add Your Keys
In the Blueprint setup screen, locate the **Environment Variables** section. You must provide values for:
- `GEMINI_API_KEY`: Get this from Google AI Studio.
- `E2B_API_KEY`: Get this from your E2B dashboard.
- `REDIS_URL`: Use a free Redis instance from [Upstash](https://upstash.com).

## 4. How to Detect & Fix Errors
- **Deployment Fails?** Click on the service (e.g., `sitegenie-api`) and look at the **"Events"** and **"Logs"** tabs.
- **Common Issue**: `REDIS_URL` not provided. If the logs say "Redis connection error," check your Upstash credentials.
- **Build Errors**: If the build fails, check the "Deploy" logs for red text indicating a missing dependency (though I have pre-validated the build).

## 5. Getting Your Public URL
- Once deployment finishes, Render will show a green **"Live"** status.
- The URL will look something like `https://sitegenie-frontend.onrender.com`.
- Simply click that link to open your app!

## 6. How to Update
Whenever you push a change to your GitHub repository, Render will **automatically** detect the change and redeploy your app within minutes.

