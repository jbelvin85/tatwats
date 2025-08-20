const fs = require('fs');
const path = require('path');

const [recipient] = process.argv.slice(2);

if (!recipient) {
  console.log('Usage: node check_messages.js <recipient>');
  process.exit(1);
}

const inboxDir = path.join(__dirname, '..', 'common_room', recipient, 'inbox');

try {
  if (!fs.existsSync(inboxDir)) {
    console.error(`Error: Inbox for ${recipient} not found.`);
    process.exit(1);
  }

  const messages = fs.readdirSync(inboxDir);

  if (messages.length === 0) {
    console.log(`No new messages for ${recipient}.`);
  } else {
    console.log(`New messages for ${recipient}:`);
    messages.forEach(message => {
      console.log(`- ${message}`);
    });
  }
} catch (error) {
  console.error(`Error checking messages: ${error.message}`);
  process.exit(1);
}
