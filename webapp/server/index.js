const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const helpersDir = path.join(__dirname, '../../helpers');
const commonRoomDir = path.join(__dirname, '../the_mediator/common_room');

// Endpoint to get all helpers
app.get('/api/helpers', (req, res) => {
  fs.readdir(helpersDir, { withFileTypes: true }, (err, entries) => {
    if (err) {
      console.error('Error reading helpers directory:', err);
      return res.status(500).json({ error: 'Failed to read helpers' });
    }
    const helpers = entries
      .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('the_'))
      .map(dirent => dirent.name);
    res.json(helpers);
  });
});

// Endpoint to get messages for a specific helper
app.get('/api/helpers/:helper/messages', (req, res) => {
  const helperName = req.params.helper;
  const inboxDir = path.join(commonRoomDir, helperName, 'inbox');

  fs.readdir(inboxDir, (err, files) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'Helper inbox not found' });
      }
      console.error(`Error reading inbox for ${helperName}:`, err);
      return res.status(500).json({ error: 'Failed to read messages' });
    }

    const messages = files.filter(file => file.endsWith('.json')).map(file => {
      const filePath = path.join(inboxDir, file);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
      } catch (parseErr) {
        console.error(`Error parsing message file ${file}:`, parseErr);
        return null; // Or handle error more robustly
      }
    }).filter(Boolean); // Remove nulls from parsing errors

    res.json(messages);
  });
});

// Endpoint to get a specific message
app.get('/api/helpers/:helper/messages/:messageId', (req, res) => {
  const helperName = req.params.helper;
  const messageId = req.params.messageId;
  const messagePath = path.join(commonRoomDir, helperName, 'inbox', `${messageId}.json`);

  fs.readFile(messagePath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'Message not found' });
      }
      console.error(`Error reading message ${messageId} for ${helperName}:`, err);
      return res.status(500).json({ error: 'Failed to read message' });
    }
    try {
      res.json(JSON.parse(data));
    } catch (parseErr) {
      console.error(`Error parsing message ${messageId}:`, parseErr);
      res.status(500).json({ error: 'Failed to parse message content' });
    }
  });
});

// Endpoint to send a new message
app.post('/api/helpers/:recipient/messages', (req, res) => {
  const recipient = req.params.recipient;
  const { sender, message } = req.body;

  if (!sender || !message) {
    return res.status(400).json({ error: 'Sender and message are required' });
  }

  const inboxDir = path.join(commonRoomDir, recipient, 'inbox');
  if (!fs.existsSync(inboxDir)) {
    return res.status(404).json({ error: 'Recipient inbox not found' });
  }

  const messageId = Date.now().toString(); // Simple unique ID
  const messageFile = path.join(inboxDir, `${messageId}.json`);

  const messageContent = {
    id: messageId,
    sender: sender,
    recipient: recipient,
    message: message,
    timestamp: new Date().toISOString()
  };

  fs.writeFile(messageFile, JSON.stringify(messageContent, null, 2), (err) => {
    if (err) {
      console.error('Error writing message file:', err);
      return res.status(500).json({ error: 'Failed to send message' });
    }
    res.status(201).json({ message: 'Message sent successfully', id: messageId });
  });
});

// Endpoint to add a new helper
app.post('/api/helpers', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Helper name is required' });
  }

  const helperDir = path.join(commonRoomDir, name);
  const inboxDir = path.join(helperDir, 'inbox');

  fs.mkdir(inboxDir, { recursive: true }, (err) => {
    if (err) {
      console.error(`Error creating helper directory for ${name}:`, err);
      return res.status(500).json({ error: 'Failed to add helper' });
    }
    res.status(201).json({ message: `Helper ${name} added successfully` });
  });
});

// Endpoint to remove a helper
app.delete('/api/helpers/:name', (req, res) => {
  const helperName = req.params.name;
  const helperDir = path.join(commonRoomDir, helperName);

  fs.rm(helperDir, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error(`Error removing helper directory for ${helperName}:`, err);
      return res.status(500).json({ error: 'Failed to remove helper' });
    }
    res.json({ message: `Helper ${helperName} removed successfully` });
  });
});

// Endpoint to edit (rename) a helper
app.put('/api/helpers/:oldName/:newName', (req, res) => {
  const oldName = req.params.oldName;
  const newName = req.params.newName;

  if (!newName) {
    return res.status(400).json({ error: 'New helper name is required' });
  }

  const oldHelperDir = path.join(commonRoomDir, oldName);
  const newHelperDir = path.join(commonRoomDir, newName);

  fs.rename(oldHelperDir, newHelperDir, (err) => {
    if (err) {
      console.error(`Error renaming helper directory from ${oldName} to ${newName}:`, err);
      return res.status(500).json({ error: 'Failed to rename helper' });
    }
    res.json({ message: `Helper ${oldName} renamed to ${newName} successfully` });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
