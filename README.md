# RaidPrep Discord Bot

A serverless Discord bot for event sign-ups, deployed on Vercel. Users can create event cards with multi-select dropdowns for various raid preparation items.

## Features

- ✅ Create event sign-up cards with `/create_event` command
- ✅ Multi-select dropdown with all raid preparation options
- ✅ Real-time updates showing who signed up for what
- ✅ Serverless deployment on Vercel
- ✅ Proper Discord interaction verification

## Raid Preparation Options

The bot includes the following sign-up options:
- Boom
- HVs
- T2
- Turrets
- UWall
- Build Mats
- Rekits
- Heavy Pot
- Deployables
- Incen
- Med Mats
- Doors

## Setup

### Prerequisites

1. Node.js 18+ installed
2. A Discord Application ([Create one here](https://discord.com/developers/applications))
3. A Vercel account ([Sign up here](https://vercel.com))

### Discord Bot Setup

1. **Create a Discord Application:**
   - Go to https://discord.com/developers/applications
   - Click "New Application" and give it a name
   - Go to the "Bot" section and create a bot
   - Copy the bot token (you'll need this later)

2. **Get Your Public Key:**
   - In your Discord application, go to "General Information"
   - Copy the "Public Key" (you'll need this for verification)

3. **Get Your Application ID:**
   - Also in "General Information", copy the "Application ID"

4. **Set Up Interactions Endpoint:**
   - Go to the "General Information" tab
   - Under "Interactions Endpoint URL", you'll set this after deploying to Vercel
   - The URL will be: `https://your-project.vercel.app/api/interactions`

5. **Invite Bot to Server:**
   - Go to "OAuth2" > "URL Generator"
   - Select scopes: `bot` and `applications.commands`
   - Select bot permissions: `Send Messages`, `Embed Links`, `Use External Emojis`
   - Copy the generated URL and open it in your browser to invite the bot

### Local Development

1. **Clone and Install:**
   ```bash
   git clone <your-repo-url>
   cd raidprep
   npm install
   ```

2. **Configure Environment Variables:**
   - Copy `env.example` to `.env`
   - Fill in your Discord credentials:
     ```
     DISCORD_PUBLIC_KEY=your_public_key_here
     DISCORD_APPLICATION_ID=your_application_id_here
     DISCORD_BOT_TOKEN=your_bot_token_here
     DISCORD_GUILD_ID=your_guild_id_here  # Optional, for faster command registration
     ```

3. **Register Commands:**
   ```bash
   node utils/register-commands.js
   ```

4. **Run Locally:**
   ```bash
   npm run dev
   ```
   This will start a local Vercel dev server. You can test your bot locally using a tool like [ngrok](https://ngrok.com/) to expose your local server to Discord.

### Deploy to Vercel

1. **Install Vercel CLI (if not already installed):**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   Follow the prompts to set up your project.

4. **Set Environment Variables in Vercel:**
   - Go to your Vercel project dashboard
   - Navigate to Settings > Environment Variables
   - Add all the variables from your `.env` file:
     - `DISCORD_PUBLIC_KEY`
     - `DISCORD_APPLICATION_ID`
     - `DISCORD_BOT_TOKEN`
     - `DISCORD_GUILD_ID` (optional)

5. **Set Interactions Endpoint in Discord:**
   - Go back to your Discord application settings
   - Under "Interactions Endpoint URL", enter: `https://your-project.vercel.app/api/interactions`
   - Click "Save Changes"
   - Discord will verify the endpoint (make sure your bot is deployed first)

6. **Redeploy (if needed):**
   ```bash
   vercel --prod
   ```

## Usage

Once set up, use the `/create_event` command in your Discord server:

```
/create_event event_name:Raid Prep Event
```

This will create an embed with a dropdown menu. Users can:
- Select multiple options from the dropdown
- See their selections reflected immediately on the event card
- See who else has signed up for each option

## Project Structure

```
raidprep/
├── api/
│   └── interactions.js      # Main API route for Discord interactions
├── utils/
│   └── register-commands.js # Script to register slash commands
├── .gitignore
├── package.json
├── vercel.json              # Vercel configuration
├── env.example              # Environment variables template
└── README.md
```

## How It Works

1. **Command Handling:** When a user runs `/create_event`, the bot creates an embed with a dropdown menu
2. **State Management:** Signups are stored in-memory (consider upgrading to a database for production)
3. **Message Updates:** When users select options, the bot updates the original message to show current signups
4. **Verification:** All requests are verified using Discord's Ed25519 signature verification

## Notes

- **State Storage:** Currently uses in-memory storage. For production, consider using:
  - Vercel KV (Redis)
  - Vercel Postgres
  - Upstash Redis
- **Rate Limits:** Discord has rate limits on API calls. The bot handles this gracefully, but be aware when testing
- **Ephemeral Responses:** User confirmations are sent as ephemeral messages (only visible to the user)

## Troubleshooting

**Commands not showing up:**
- Make sure you've run `node utils/register-commands.js`
- Global commands can take up to 1 hour to propagate
- Use `DISCORD_GUILD_ID` for instant guild-specific commands

**Interactions not working:**
- Verify your `DISCORD_PUBLIC_KEY` is correct
- Check that the Interactions Endpoint URL is set correctly in Discord
- Ensure your Vercel deployment is live and environment variables are set

**Message updates failing:**
- Check that `DISCORD_BOT_TOKEN` is set correctly
- Verify the bot has permissions to edit messages in the channel

## License

MIT

