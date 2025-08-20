
const fs = require('fs');
const path = require('path');

const [sender, recipient, message] = process.argv.slice(2);

if (!sender || !recipient || !message) {
  console.log('Usage: node send_message.js <sender> <recipient> "<message>"');
  process.exit(1);
}

const messageId = Date.now().toString();
const messageFile = path.join(__dirname, '..', 'common_room', recipient, 'inbox', `${messageId}.json`);

const messageContent = {
  id: messageId,
  sender: sender,
  recipient: recipient,
  message: message,
};

try {
  fs.writeFileSync(messageFile, JSON.stringify(messageContent, null, 2));
  console.log(`Message sent to ${recipient}.`);
} catch (error) {
  console.error(`Error sending message: ${error.message}`);
  // Ensure the directory exists
  const inboxDir = path.dirname(messageFile);
  if (!fs.existsSync(inboxDir)) {
    console.error(`Inbox directory does not exist: ${inboxDir}`);
    console.error('Please ensure the helper inboxes have been created in helpers/the_mediator/common_room/');
  }
  process.exit(1);
}
