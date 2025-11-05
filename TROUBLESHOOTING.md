# Troubleshooting Discord Interactions Endpoint

## Common Issues and Solutions

### Issue: Interactions Endpoint URL Verification Fails

**Symptoms:**
- Discord shows "Failed" when setting the Interactions Endpoint URL
- Endpoint verification times out

**Solutions:**

#### 1. Check Environment Variables in Vercel

Make sure all environment variables are set correctly:
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Verify these are set:
  - `DISCORD_PUBLIC_KEY` (should be your application's Public Key, not the bot token)
  - `DISCORD_APPLICATION_ID`
  - `DISCORD_BOT_TOKEN`
  - `DISCORD_GUILD_ID` (optional)

**Important:** The `DISCORD_PUBLIC_KEY` is different from the bot token. Get it from:
- Discord Developer Portal → Your Application → General Information → Public Key

#### 2. Verify Your Deployment is Live

1. Check that your Vercel deployment is successful
2. Visit your endpoint URL: `https://your-project.vercel.app/api/interactions`
3. You should see: `{"status":"ok"}`

#### 3. Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project → Functions
2. Click on `api/interactions`
3. View the logs to see any errors
4. Look for:
   - "DISCORD_PUBLIC_KEY not set" → Environment variable missing
   - "Invalid signature" → Public key mismatch or body parsing issue
   - "Missing signature headers" → Request not from Discord

#### 4. Verify the URL Format

The Interactions Endpoint URL should be:
```
https://your-project-name.vercel.app/api/interactions
```

**Common mistakes:**
- ❌ Forgetting `/api/interactions` at the end
- ❌ Using `http://` instead of `https://`
- ❌ Extra trailing slashes
- ❌ Wrong project name

#### 5. Test the Endpoint Manually

You can test if your endpoint is working:

```bash
# Test GET request (should return {"status":"ok"})
curl https://your-project.vercel.app/api/interactions

# Test POST request (should return 401 without proper headers, which is expected)
curl -X POST https://your-project.vercel.app/api/interactions
```

#### 6. Signature Verification Issues

If you see "Invalid signature" errors in logs:

**Possible causes:**
1. **Wrong Public Key**: Make sure `DISCORD_PUBLIC_KEY` matches your application's Public Key
2. **Body Parsing**: Vercel automatically parses JSON, which can cause signature mismatches
3. **Environment Variable Format**: Make sure there are no extra spaces or quotes

**Fix:**
- Double-check the Public Key in Discord Developer Portal
- Ensure environment variables don't have quotes around values
- Redeploy after changing environment variables

#### 7. Wait for Deployment

After setting environment variables:
1. **Redeploy** your project (or wait for auto-deploy)
2. **Wait 1-2 minutes** for the deployment to complete
3. **Then** try setting the Interactions Endpoint URL in Discord

#### 8. Check Discord Rate Limits

Discord may rate limit verification attempts. If it fails:
- Wait a few minutes
- Try again
- Make sure your endpoint is accessible first

### Issue: Bot Responds But Commands Don't Work

**Solutions:**

1. **Register Commands:**
   ```bash
   npm run register
   ```
   Or set `DISCORD_GUILD_ID` for faster guild-specific registration

2. **Wait for Global Commands:**
   - Global commands can take up to 1 hour to propagate
   - Use guild-specific commands for testing (set `DISCORD_GUILD_ID`)

3. **Check Bot Permissions:**
   - Bot needs `applications.commands` scope
   - Re-invite bot with correct permissions

### Issue: 500 Internal Server Error

**Check Vercel Logs:**
1. Go to Vercel Dashboard → Functions → api/interactions
2. Look for error messages
3. Common causes:
   - Missing environment variables
   - Invalid bot token
   - Network errors when updating messages

### Debugging Steps

1. **Check Environment Variables:**
   ```bash
   # Locally, verify your .env file
   npm run check-env
   ```

2. **Test Locally First:**
   ```bash
   npm run dev
   # Use ngrok to expose local server
   # Set ngrok URL as Interactions Endpoint temporarily
   ```

3. **Verify Public Key:**
   - Discord Developer Portal → General Information → Public Key
   - Should be a long string starting with letters/numbers
   - NOT the same as Application ID or Bot Token

4. **Check Deployment Status:**
   - Vercel Dashboard → Deployments
   - Make sure latest deployment is "Ready"

## Still Having Issues?

1. **Check Vercel Logs** - Most errors will show up here
2. **Verify Environment Variables** - Use `npm run check-env` locally
3. **Test Endpoint Manually** - Use curl or Postman
4. **Discord Developer Portal** - Check for any error messages
5. **GitHub Issues** - Check if others have similar issues

## Quick Checklist

- [ ] All environment variables set in Vercel
- [ ] Deployment is successful and live
- [ ] Endpoint URL is correct format
- [ ] Public Key matches Discord Developer Portal
- [ ] Bot token is valid (not expired)
- [ ] Commands are registered (`npm run register`)
- [ ] Bot is invited to server with correct permissions

