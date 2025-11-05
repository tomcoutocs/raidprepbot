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
    console.error('Error registering commands:', error);
  }
})();

