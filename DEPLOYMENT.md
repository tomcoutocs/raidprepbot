# Vercel Deployment Guide

This guide will walk you through deploying your Discord bot to Vercel and connecting it to your GitHub repository.

## Prerequisites

- ✅ Code pushed to GitHub (already done!)
- ✅ Vercel account ([Sign up here](https://vercel.com))
- ✅ Discord bot credentials ready

## Step 1: Import Project to Vercel

1. **Go to Vercel Dashboard:**
   - Visit https://vercel.com
   - Sign in or create an account

2. **Import GitHub Repository:**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Choose `tomcoutocs/raidprepbot` from the list
   - Click "Import"

3. **Configure Project:**
   - **Framework Preset:** Other (or leave as default)
   - **Root Directory:** `./` (default)
   - **Build Command:** Leave empty (no build needed)
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`

## Step 2: Set Environment Variables

Before deploying, add your Discord bot credentials:

1. **In Vercel Project Settings:**
   - Go to your project → Settings → Environment Variables

2. **Add the following variables:**
   ```
   DISCORD_PUBLIC_KEY=your_public_key_here
   DISCORD_APPLICATION_ID=your_application_id_here
   DISCORD_BOT_TOKEN=your_bot_token_here
   DISCORD_GUILD_ID=your_guild_id_here  # Optional
   ```

3. **Apply to:**
   - Select "Production", "Preview", and "Development" environments
   - Click "Save"

## Step 3: Deploy

1. **Deploy the Project:**
   - Click "Deploy" in the Vercel dashboard
   - Wait for the deployment to complete (usually 1-2 minutes)

2. **Get Your Deployment URL:**
   - Once deployed, you'll see a URL like: `https://raidprepbot-xxxxx.vercel.app`
   - Copy this URL

## Step 4: Configure Discord Interactions Endpoint

1. **Go to Discord Developer Portal:**
   - Visit https://discord.com/developers/applications
   - Select your application

2. **Set Interactions Endpoint URL:**
   - Go to "General Information" tab
   - Scroll to "Interactions Endpoint URL"
   - Enter: `https://your-project-name.vercel.app/api/interactions`
   - Replace `your-project-name` with your actual Vercel project name
   - Click "Save Changes"
   - Discord will verify the endpoint (make sure your deployment is live first!)

## Step 5: Register Commands

1. **Local Setup (for testing):**
   ```bash
   # Make sure your .env file has your credentials
   npm run check-env
   npm run register
   ```

2. **Or register via Vercel Function:**
   - You can also create a temporary API route to register commands
   - Or use the local method above (recommended)

## Step 6: Test Your Bot

1. **Invite Bot to Server:**
   - Go to Discord Developer Portal → OAuth2 → URL Generator
   - Select scopes: `bot` and `applications.commands`
   - Select permissions: `Send Messages`, `Embed Links`, `Use External Emojis`
   - Copy the URL and open it to invite the bot

2. **Test the Command:**
   - In your Discord server, type: `/create_event`
   - The bot should respond with an event card!

## Continuous Deployment

✅ **Automatic Deployments:** Vercel will automatically deploy when you push to GitHub!

- Push to `main` branch → Production deployment
- Create a pull request → Preview deployment

## Troubleshooting

### Bot Not Responding

1. **Check Environment Variables:**
   - Verify all variables are set in Vercel dashboard
   - Check that values don't have extra spaces or quotes

2. **Check Interactions Endpoint:**
   - Verify the URL is correct in Discord Developer Portal
   - Ensure the endpoint shows a green checkmark (verified)

3. **Check Vercel Logs:**
   - Go to Vercel Dashboard → Your Project → Functions
   - Click on `api/interactions` → View logs
   - Look for any errors

### 401 Unauthorized Errors

- Verify `DISCORD_PUBLIC_KEY` is correct
- Ensure signature verification is working (check Vercel logs)

### Commands Not Showing

- Run `npm run register` locally to register commands
- Wait up to 1 hour for global commands to propagate
- Use `DISCORD_GUILD_ID` for instant guild-specific commands

## Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [Project Repository](https://github.com/tomcoutocs/raidprepbot)

