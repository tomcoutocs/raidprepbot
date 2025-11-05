require('dotenv').config();

console.log('\n🔍 Checking Discord Bot Configuration...\n');

const requiredVars = [
  { name: 'DISCORD_PUBLIC_KEY', description: 'Public Key (from General Information)' },
  { name: 'DISCORD_APPLICATION_ID', description: 'Application ID (from General Information)' },
  { name: 'DISCORD_BOT_TOKEN', description: 'Bot Token (from Bot section)' },
];

let allSet = true;

requiredVars.forEach(({ name, description }) => {
  const value = process.env[name];
  if (!value || value.includes('your_') || value.includes('here')) {
    console.log(`❌ ${name}: NOT SET`);
    console.log(`   Expected: ${description}`);
    allSet = false;
  } else {
    // Mask sensitive values
    const masked = value.length > 10 
      ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
      : '***';
    console.log(`✅ ${name}: ${masked}`);
    
    // Additional validation for Application ID
    if (name === 'DISCORD_APPLICATION_ID') {
      // Application ID should be a numeric string (Discord uses Snowflake IDs)
      if (!/^\d+$/.test(value)) {
        console.log(`   ⚠️  WARNING: Application ID should be numeric, got: ${value}`);
        console.log(`   Make sure you're using the Application ID, not the Public Key!`);
      } else if (value.length < 17 || value.length > 19) {
        console.log(`   ⚠️  WARNING: Application ID length seems unusual (${value.length} digits)`);
        console.log(`   Typical Discord Application IDs are 17-19 digits long`);
      }
    }
  }
});

if (process.env.DISCORD_GUILD_ID) {
  console.log(`✅ DISCORD_GUILD_ID: ${process.env.DISCORD_GUILD_ID} (optional)`);
} else {
  console.log(`ℹ️  DISCORD_GUILD_ID: Not set (will register global commands)`);
}

console.log('\n');

if (!allSet) {
  console.log('📝 To get your Discord credentials:');
  console.log('   1. Go to https://discord.com/developers/applications');
  console.log('   2. Select your application (or create a new one)');
  console.log('   3. Navigate to:');
  console.log('      - General Information > Application ID');
  console.log('      - General Information > Public Key');
  console.log('      - Bot > Token (click "Reset Token" if needed)');
  console.log('   4. Update your .env file with these values\n');
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set!\n');
}

