require('dotenv').config();

console.log('\n🔍 Testing Environment Variable Access...\n');

// Test all Discord environment variables
const vars = {
  'DISCORD_PUBLIC_KEY': process.env.DISCORD_PUBLIC_KEY,
  'DISCORD_APPLICATION_ID': process.env.DISCORD_APPLICATION_ID,
  'DISCORD_BOT_TOKEN': process.env.DISCORD_BOT_TOKEN,
  'DISCORD_GUILD_ID': process.env.DISCORD_GUILD_ID,
};

console.log('Environment Variables Status:');
console.log('─────────────────────────────');

Object.entries(vars).forEach(([name, value]) => {
  if (!value) {
    console.log(`❌ ${name}: undefined or empty`);
  } else if (value.includes('your_') || value.includes('here')) {
    console.log(`⚠️  ${name}: Contains placeholder text`);
    console.log(`   Value: ${value.substring(0, 50)}...`);
  } else {
    // Show masked value
    const masked = value.length > 20 
      ? `${value.substring(0, 8)}...${value.substring(value.length - 8)}`
      : value.length > 10
      ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
      : '***';
    console.log(`✅ ${name}: Set (${value.length} chars)`);
    console.log(`   Masked: ${masked}`);
    
    // Special validation for Application ID
    if (name === 'DISCORD_APPLICATION_ID') {
      if (!/^\d+$/.test(value)) {
        console.log(`   ⚠️  WARNING: Should be numeric only!`);
        console.log(`   Actual value type: ${typeof value}`);
        console.log(`   First 20 chars: ${value.substring(0, 20)}`);
      } else {
        console.log(`   ✅ Valid format (numeric, ${value.length} digits)`);
      }
    }
  }
});

console.log('\n');

// Test if we can access them programmatically
console.log('Programmatic Access Test:');
console.log('─────────────────────────');
try {
  const appId = process.env.DISCORD_APPLICATION_ID;
  console.log(`typeof DISCORD_APPLICATION_ID: ${typeof appId}`);
  console.log(`Value: ${appId || 'undefined'}`);
  console.log(`Length: ${appId ? appId.length : 0}`);
  
  if (appId) {
    console.log(`Can parse as number: ${!isNaN(Number(appId))}`);
    console.log(`First 10 chars: ${appId.substring(0, 10)}`);
  }
} catch (error) {
  console.error('Error accessing DISCORD_APPLICATION_ID:', error);
}

console.log('\n');

