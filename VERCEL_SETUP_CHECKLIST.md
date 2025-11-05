# Vercel Setup Checklist for Discord Bot

## Fixing 502 BAD_GATEWAY / DNS_HOSTNAME_NOT_FOUND Error

### Step 1: Verify Environment Variables in Vercel

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Select your project

2. **Navigate to Settings → Environment Variables**

3. **Verify ALL variables are set (NO QUOTES, NO SPACES):**

   ```
   DISCORD_PUBLIC_KEY=abc123def456... (long string from Discord)
   DISCORD_APPLICATION_ID=123456789012345678
   DISCORD_BOT_TOKEN=abc123.xyz789.ABC123def456... (long token)
   ```

   **Important Notes:**
   - ❌ Don't add quotes: `DISCORD_BOT_TOKEN="token"` 
   - ✅ Correct: `DISCORD_BOT_TOKEN=token`
   - ❌ Don't add spaces: `DISCORD_BOT_TOKEN = token`
   - ✅ Correct: `DISCORD_BOT_TOKEN=token`

4. **Apply to ALL environments:**
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

5. **Click "Save"**

### Step 2: Get Correct Values from Discord

1. **Public Key:**
   - Go to: https://discord.com/developers/applications
   - Select your application
   - Go to **General Information**
   - Copy the **Public Key** (NOT Application ID, NOT Bot Token)
   - Should look like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

2. **Application ID:**
   - Same page (General Information)
   - Copy the **Application ID**
   - Should be a long number: `123456789012345678`

3. **Bot Token:**
   - Go to **Bot** section (left sidebar)
   - Click **Reset Token** if needed (copy it immediately!)
   - Copy the **Token**
   - Should be a long string with dots separating sections

### Step 3: Redeploy After Setting Variables

**After setting environment variables, you MUST redeploy:**

1. **Option A: Push a new commit**
   ```bash
   git commit --allow-empty -m "Trigger redeploy"
   git push
   ```

2. **Option B: Redeploy from Vercel Dashboard**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

3. **Wait for deployment to complete** (1-2 minutes)

### Step 4: Test the Endpoint

1. **Test GET request (should work):**
   ```
   https://your-project.vercel.app/api/interactions
   ```
   Should return: `{"status":"ok"}`

2. **If GET works but POST fails:**
   - Check Vercel Function Logs
   - Go to: Vercel Dashboard → Your Project → Functions → api/interactions
   - Look for error messages

### Step 5: Set Discord Interactions Endpoint

**Only after steps 1-4 are complete:**

1. Go to: https://discord.com/developers/applications
2. Select your application
3. Go to **General Information**
4. Scroll to **Interactions Endpoint URL**
5. Enter: `https://your-project-name.vercel.app/api/interactions`
6. Click **Save Changes**
7. Discord will verify (should show green checkmark)

### Common Issues and Fixes

#### Issue: "DISCORD_PUBLIC_KEY not set" in logs
**Fix:** Add `DISCORD_PUBLIC_KEY` environment variable in Vercel

#### Issue: "Invalid signature" in logs  
**Fix:** 
- Verify `DISCORD_PUBLIC_KEY` matches the Public Key from Discord
- Make sure there are no extra spaces or quotes
- Redeploy after changing

#### Issue: DNS_HOSTNAME_NOT_FOUND
**Fix:**
- Check all environment variables are set correctly
- Verify bot token is valid (not expired)
- Make sure you redeployed after setting variables
- Check Vercel logs for specific error

#### Issue: Endpoint verification fails
**Fix:**
- Make sure deployment is live (check Deployments tab)
- Verify URL format: `https://project-name.vercel.app/api/interactions`
- Wait 1-2 minutes after deployment before verifying
- Check Vercel logs for errors

### Quick Diagnostic Commands

Test locally first:
```bash
# Check environment variables
npm run check-env

# Test the endpoint locally (if you have ngrok set up)
npm run dev
```

### Still Having Issues?

1. **Check Vercel Logs:**
   - Vercel Dashboard → Functions → api/interactions → Logs
   - Look for specific error messages

2. **Verify Environment Variables:**
   - Double-check each variable in Vercel dashboard
   - Make sure values match Discord Developer Portal exactly

3. **Test Endpoint Manually:**
   ```bash
   # Should return {"status":"ok"}
   curl https://your-project.vercel.app/api/interactions
   ```

4. **Check Deployment Status:**
   - Make sure latest deployment shows "Ready" (green)
   - Not "Building" or "Error"

