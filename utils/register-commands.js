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

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    const applicationId = process.env.DISCORD_APPLICATION_ID;
    const guildId = process.env.DISCORD_GUILD_ID; // Optional: for guild-specific commands

    // Validate required environment variables
    if (!applicationId) {
      console.error('❌ ERROR: DISCORD_APPLICATION_ID is not set!');
      console.error('   Please set it in your .env file or environment variables.');
      process.exit(1);
    }

    if (!process.env.DISCORD_BOT_TOKEN) {
      console.error('❌ ERROR: DISCORD_BOT_TOKEN is not set!');
      console.error('   Please set it in your .env file or environment variables.');
      process.exit(1);
    }

    console.log(`✅ Application ID: ${applicationId.substring(0, 10)}...`);
    if (guildId) {
      console.log(`✅ Guild ID: ${guildId}`);
    }

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

