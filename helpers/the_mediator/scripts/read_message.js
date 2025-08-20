const fs = require('fs');
const path = require('path');

const [recipient, messageId] = process.argv.slice(2);

if (!recipient || !messageId) {
  console.log('Usage: node read_message.js <recipient> <message_id>');
  process.exit(1);
}

const messageFile = path.join(__dirname, '..', 'common_room', recipient, 'inbox', messageId);

try {
  if (!fs.existsSync(messageFile)) {
    console.error('Error: Message not found.');
    process.exit(1);
  }

  const messageContent = fs.readFileSync(messageFile, 'utf8');
  console.log(messageContent);
} catch (error) {
  console.error(`Error reading message: ${error.message}`);
  process.exit(1);
}
