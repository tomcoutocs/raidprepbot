const { InteractionType, InteractionResponseType } = require('discord-interactions');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/rest/v10');

// In-memory store for event signups
// In production, consider using a database like Redis or Vercel KV
const eventSignups = new Map();

// Event options
const EVENT_OPTIONS = [
  { label: 'Boom', value: 'boom' },
  { label: 'HVs', value: 'hvs' },
  { label: 'T2', value: 't2' },
  { label: 'Turrets', value: 'turrets' },
  { label: 'UWall', value: 'uwall' },
  { label: 'Build Mats', value: 'build_mats' },
  { label: 'Rekits', value: 'rekits' },
  { label: 'Heavy Pot', value: 'heavy_pot' },
  { label: 'Deployables', value: 'deployables' },
  { label: 'Incen', value: 'incen' },
  { label: 'Med Mats', value: 'med_mats' },
  { label: 'Doors', value: 'doors' },
];

module.exports = async (req, res) => {
  // Handle GET requests (health check)
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok' });
  }

  // Verify Discord signature
  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  if (!publicKey) {
    console.error('DISCORD_PUBLIC_KEY not set');
    return res.status(500).json({ error: 'DISCORD_PUBLIC_KEY not set' });
  }

  try {
    const signature = req.headers['x-signature-ed25519'];
    const timestamp = req.headers['x-signature-timestamp'];
    
    if (!signature || !timestamp) {
      console.error('Missing signature headers');
      return res.status(401).json({ error: 'Missing signature headers' });
    }

    // Get raw body - try multiple methods for Vercel compatibility
    let rawBody;
    
    // Method 1: Check if rawBody is available (some Vercel configurations)
    if (req.rawBody) {
      rawBody = typeof req.rawBody === 'string' ? req.rawBody : req.rawBody.toString();
    }
    // Method 2: Check if body is already a string
    else if (typeof req.body === 'string') {
      rawBody = req.body;
    }
    // Method 3: Stringify parsed body (fallback - may fail verification)
    else if (req.body) {
      rawBody = JSON.stringify(req.body);
    }
    else {
      return res.status(400).json({ error: 'No request body' });
    }
    
    const { verifyKey } = require('discord-interactions');
    const isValid = verifyKey(rawBody, signature, timestamp, publicKey);

    if (!isValid) {
      console.error('Invalid signature verification');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Parse interaction body
    const interaction = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // Handle PING (Discord's verification request)
    // This is the first thing Discord sends to verify the endpoint
    // Must respond quickly without any external API calls
    if (interaction.type === InteractionType.PING) {
      console.log('Received PING from Discord - responding with PONG');
      return res.json({ type: InteractionResponseType.PONG });
    }

    // Handle APPLICATION_COMMAND (slash commands)
    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
      return handleCommand(interaction, res);
    }

    // Handle MESSAGE_COMPONENT (button/dropdown interactions)
    if (interaction.type === InteractionType.MESSAGE_COMPONENT) {
      return handleComponent(interaction, res);
    }

    return res.status(400).json({ error: 'Unknown interaction type' });
  } catch (error) {
    console.error('Error handling interaction:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    
    // Return appropriate error response
    if (error.message && error.message.includes('DNS')) {
      console.error('DNS resolution error - check environment variables and network connectivity');
    }
    
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

async function handleCommand(interaction, res) {
  const commandName = interaction.data.name;

  if (commandName === 'create_event') {
    const eventName = interaction.data.options?.[0]?.value || 'Raid Event';
    const eventId = `${interaction.channel_id}_${Date.now()}`;

    // Initialize signups for this event
    eventSignups.set(eventId, new Map());

    const components = [
      {
        type: 1, // ACTION_ROW
        components: [
          {
            type: 3, // STRING_SELECT
            custom_id: `event_signup_${eventId}`,
            placeholder: 'Select your options',
            min_values: 0,
            max_values: EVENT_OPTIONS.length,
            options: EVENT_OPTIONS,
          },
        ],
      },
    ];

    const embed = {
      title: `📋 ${eventName}`,
      description: 'Select your options below to sign up:',
      color: 0x5865f2,
      fields: EVENT_OPTIONS.map(option => ({
        name: option.label,
        value: 'No signups yet',
        inline: true,
      })),
      footer: {
        text: 'Select multiple options to sign up',
      },
      timestamp: new Date().toISOString(),
    };

    return res.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        embeds: [embed],
        components: components,
      },
    });
  }

  return res.status(400).json({ error: 'Unknown command' });
}

async function handleComponent(interaction, res) {
  const customId = interaction.data.custom_id;

  if (customId.startsWith('event_signup_')) {
    const eventId = customId.replace('event_signup_', '');
    const selectedValues = interaction.data.values || [];
    const userId = interaction.member.user.id;
    const username = interaction.member.user.username;
    const displayName = interaction.member.nick || interaction.member.user.global_name || username;

    // Get or initialize signups for this event
    if (!eventSignups.has(eventId)) {
      eventSignups.set(eventId, new Map());
    }
    const signups = eventSignups.get(eventId);

    // Update signups for this user
    if (selectedValues.length === 0) {
      // User cleared all selections
      signups.delete(userId);
    } else {
      signups.set(userId, {
        username: displayName,
        options: selectedValues,
      });
    }

    // Build updated embed
    const optionMap = new Map(EVENT_OPTIONS.map(opt => [opt.value, opt.label]));
    const fields = EVENT_OPTIONS.map(option => {
      const signupList = [];
      signups.forEach((signup, uid) => {
        if (signup.options.includes(option.value)) {
          signupList.push(signup.username);
        }
      });

      return {
        name: option.label,
        value: signupList.length > 0 ? signupList.join(', ') : 'No signups yet',
        inline: true,
      };
    });

    const embed = {
      title: interaction.message.embeds[0]?.title || '📋 Event Signup',
      description: 'Select your options below to sign up:',
      color: 0x5865f2,
      fields: fields,
      footer: {
        text: 'Select multiple options to sign up',
      },
      timestamp: interaction.message.embeds[0]?.timestamp || new Date().toISOString(),
    };

    // Validate bot token before making API calls
    const botToken = process.env.DISCORD_BOT_TOKEN;
    if (!botToken) {
      console.error('DISCORD_BOT_TOKEN not set');
      return res.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: '❌ Bot configuration error. Please contact the administrator.',
          flags: 64, // EPHEMERAL
        },
      });
    }

    // Acknowledge the interaction and update the message
    const rest = new REST({ version: '10' }).setToken(botToken);

    try {
      // Update the original message
      await rest.patch(
        Routes.channelMessage(interaction.channel_id, interaction.message.id),
        {
          body: {
            embeds: [embed],
            components: interaction.message.components,
          },
        }
      );

      // Send ephemeral confirmation
      return res.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: selectedValues.length > 0
            ? `✅ You've signed up for: ${selectedValues.map(v => optionMap.get(v)).join(', ')}`
            : '✅ Your signup has been cleared',
          flags: 64, // EPHEMERAL
        },
      });
    } catch (error) {
      console.error('Error updating message:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.status,
        name: error.name,
      });
      
      // Return a user-friendly error message
      return res.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: '❌ Error updating signup. Please try again.',
          flags: 64, // EPHEMERAL
        },
      });
    }
  }

  return res.status(400).json({ error: 'Unknown component' });
}
