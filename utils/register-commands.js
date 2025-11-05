require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/rest/v10');

const commands = [
  {
    name: 'create_event',
    description: 'Create an event sign-up card',
    options: [
      {
        type: 3, // STRING
        name: 'event_name',
        description: 'Name of the event',
        required: false,
      },
    ],
  },
];

// REST client will be initialized after validation
let rest;

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    const applicationId = process.env.DISCORD_APPLICATION_ID;
    const guildId = process.env.DISCORD_GUILD_ID; // Optional: for guild-specific commands

    // Validate required environment variables
    if (!applicationId || applicationId.includes('your_') || applicationId.includes('here')) {
      console.error('❌ ERROR: DISCORD_APPLICATION_ID is not set correctly!');
      console.error('   Current value:', applicationId || 'undefined');
      console.error('   Please set it in your .env file with your actual Application ID.');
      console.error('   Get it from: https://discord.com/developers/applications → General Information → Application ID');
      process.exit(1);
    }

    const botToken = process.env.DISCORD_BOT_TOKEN;
    if (!botToken || botToken.includes('your_') || botToken.includes('here')) {
      console.error('❌ ERROR: DISCORD_BOT_TOKEN is not set correctly!');
      console.error('   Current value:', botToken ? `${botToken.substring(0, 10)}...` : 'undefined');
      console.error('   Please set it in your .env file with your actual Bot Token.');
      console.error('   Get it from: https://discord.com/developers/applications → Bot → Token');
      process.exit(1);
    }

    // Validate Application ID format
    if (!/^\d+$/.test(applicationId)) {
      console.error('❌ ERROR: DISCORD_APPLICATION_ID must be numeric!');
      console.error('   Current value:', applicationId);
      console.error('   Application ID should be a number (17-19 digits)');
      console.error('   Make sure you\'re using the Application ID, not the Public Key!');
      process.exit(1);
    }

    console.log(`✅ Application ID: ${applicationId.substring(0, 10)}... (${applicationId.length} digits)`);
    if (guildId) {
      console.log(`✅ Guild ID: ${guildId}`);
    }

    // Initialize REST client with validated token
    rest = new REST({ version: '10' }).setToken(botToken);

    if (guildId) {
      // Register guild-specific commands (faster, for testing)
      await rest.put(
        Routes.applicationGuildCommands(applicationId, guildId),
        { body: commands }
      );
      console.log(`Successfully reloaded application (/) commands for guild ${guildId}.`);
    } else {
      // Register global commands (can take up to 1 hour to propagate)
      await rest.put(
        Routes.applicationCommands(applicationId),
        { body: commands }
      );
      console.log('Successfully reloaded application (/) commands globally.');
    }
  } catch (error) {
    console.error('❌ Error registering commands:', error.message);
    if (error.status === 401) {
      console.error('   This usually means DISCORD_BOT_TOKEN is invalid or expired.');
    } else if (error.status === 404) {
      console.error('   This usually means DISCORD_APPLICATION_ID is incorrect.');
    }
    console.error('   Full error:', error);
    process.exit(1);
  }
})();

