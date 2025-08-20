const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { getHelperResponse } = require('./gemini_interpreter');

const commonRoomDir = path.join(__dirname, '../common_room');
const send_message_script = path.join(__dirname, './send_message.js');

console.log(`Watching for new messages in: ${commonRoomDir}`);

// Initialize watcher
const watcher = chokidar.watch(`${commonRoomDir}/*/inbox/*.json`, {
  ignored: /(^|\/)\.|\/processed/, // ignore dotfiles and processed directory
  persistent: true,
  ignoreInitial: true // Don't trigger on files already present when starting
});

watcher.on('add', async (filePath) => {
  console.log(`New message detected: ${filePath}`);

  try {
    const messageContent = fs.readFileSync(filePath, 'utf8');
    const message = JSON.parse(messageContent);

    const { id, sender, recipient, message: incomingMessage } = message;

    console.log(`Processing message ${id} from ${sender} to ${recipient}`);

    // Get response from Gemini Interpreter
    const helperResponse = await getHelperResponse(recipient, incomingMessage);

    // Send response back to sender
    const command = `${send_message_script} "${recipient}" "${sender}" "${helperResponse}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
    });

    // Move processed message to 'processed' folder
    const processedDir = path.join(path.dirname(filePath), 'processed');
    if (!fs.existsSync(processedDir)) {
      fs.mkdirSync(processedDir);
    }
    const newPath = path.join(processedDir, path.basename(filePath));
    fs.renameSync(filePath, newPath);
    console.log(`Message ${id} moved to processed folder.`);

  } catch (error) {
    console.error(`Error processing message ${filePath}:`, error);
  }
});

watcher.on('error', (error) => console.error(`Watcher error: ${error}`));

console.log('Message listener started. Waiting for new messages...');
