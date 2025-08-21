require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const helpersDir = path.join(__dirname, '../../helpers');
const commonRoomDir = path.join(__dirname, '../the_mediator/common_room');

// --- Process Management Variables ---
const runningProcesses = new Map(); // Stores child process objects
let processConfig = {}; // Will be loaded from helpers.json

// --- Load Process Configuration from Manifest ---
const loadProcessConfig = () => {
  try {
    const manifestPath = path.join(__dirname, '../../helpers.json');
    const manifestData = fs.readFileSync(manifestPath, 'utf8');
    const processes = JSON.parse(manifestData);

    const newConfig = {};
    processes.forEach(p => {
      newConfig[p.id] = {
        ...p,
        cwd: path.join(__dirname, '../../', p.cwd), // Resolve cwd relative to project root
      };
    });

    // Add specific status checks that can't be serialized in JSON
    if (newConfig.backend) {
      newConfig.backend.statusCheck = (pid) => new Promise(resolve => {
        exec(`netstat -ano | findstr :${PORT}`, (error, stdout) => {
          if (stdout && stdout.includes(String(pid))) {
            resolve('Running');
          } else {
            // Fallback to tasklist if port check fails
            exec(`tasklist /FI "PID eq ${pid}"`, (err, tasklistStdout) => {
              resolve(tasklistStdout.includes(String(pid)) ? 'Running' : 'Stopped');
            });
          }
        });
      });
    }
    
    // Generic status check for other processes
    require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const { pool, initializeDatabase } = require('./database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const helpersDir = path.join(__dirname, '../../helpers');
const commonRoomDir = path.join(__dirname, '../the_mediator/common_room');

// --- Process Management Variables ---
const runningProcesses = new Map();
let processConfig = {}; // Will be loaded from the database

// --- Load Process Configuration from Database ---
const loadProcessConfigFromDb = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM helpers');
    const newConfig = {};
    rows.forEach(p => {
      newConfig[p.id] = {
        ...p, // id, name, description, command, args, cwd
        cwd: path.join(__dirname, '../../', p.cwd), // Resolve cwd relative to project root
      };
    });

    // Add specific, non-serializable status checks
    if (newConfig.backend) {
      newConfig.backend.statusCheck = (pid) => new Promise(resolve => {
        exec(`netstat -ano | findstr :${PORT}`, (error, stdout) => {
          if (stdout && stdout.includes(String(pid))) {
            resolve('Running');
          } else {
            exec(`tasklist /FI "PID eq ${pid}"`, (err, tasklistStdout) => {
              resolve(tasklistStdout.includes(String(pid)) ? 'Running' : 'Stopped');
            });
          }
        });
      });
    }

    const genericStatusCheck = (pid) => new Promise(resolve => {
      exec(`tasklist /FI "PID eq ${pid}"`, (err, stdout) => {
        resolve(stdout.includes(String(pid)) ? 'Running' : 'Stopped');
      });
    });

    if (newConfig.frontend) newConfig.frontend.statusCheck = genericStatusCheck;
    if (newConfig.mediator) newConfig.mediator.statusCheck = genericStatusCheck;

    processConfig = newConfig;
    console.log('Successfully loaded process configuration from the database.');
  } catch (error) {
    console.error('Failed to load process configuration from database:', error);
    process.exit(1);
  }
};


// --- Helper Functions for Process Management ---
const getProcessStatus = async (id) => {
  const config = processConfig[id];
  if (!config) return 'Unknown';

  const childProcess = runningProcesses.get(id);
  if (!childProcess || childProcess.killed) {
    return 'Stopped';
  }

  if (config.statusCheck) {
    return await config.statusCheck(childProcess.pid);
  } else {
    return new Promise(resolve => {
      exec(`tasklist /FI "PID eq ${childProcess.pid}"`, (err, stdout) => {
        if (stdout.includes(String(childProcess.pid))) {
          resolve('Running');
        } else {
          resolve('Stopped');
        }
      });
    });
  }
};

// --- Process Management API Endpoints ---

app.get('/api/processes', (req, res) => {
  const clientSafeConfig = Object.values(processConfig).map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
  }));
  res.json(clientSafeConfig);
});

app.post('/api/processes/start/:id', async (req, res) => {
  const { id } = req.params;
  const config = processConfig[id];

  if (!config) {
    return res.status(404).json({ error: 'Process not found' });
  }

  if (runningProcesses.has(id)) {
    const status = await getProcessStatus(id);
    if (status === 'Running') {
      return res.status(400).json({ message: `${config.name} is already running.` });
    }
  }

  try {
    const child = spawn(config.command, config.args, {
      cwd: config.cwd,
      detached: true,
      stdio: 'ignore',
      shell: true
    });
    child.unref();
    runningProcesses.set(id, child);
    console.log(`${config.name} started with PID: ${child.pid}`);
    setTimeout(async () => {
      const status = await getProcessStatus(id);
      res.json({ message: `${config.name} started.`, status, pid: child.pid });
    }, 2000);
  } catch (error) {
    console.error(`Error starting ${config.name}:`, error);
    res.status(500).json({ error: `Failed to start ${config.name}.`, details: error.message });
  }
});

app.post('/api/processes/stop/:id', async (req, res) => {
  const { id } = req.params;
  const config = processConfig[id];
  if (!config) {
    return res.status(404).json({ error: 'Process not found' });
  }
  const childProcess = runningProcesses.get(id);
  if (!childProcess) {
    return res.status(400).json({ message: `${config.name} is not running (no tracked PID).` });
  }
  try {
    exec(`taskkill /PID ${childProcess.pid} /F /T`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error killing process ${childProcess.pid} for ${config.name}:`, error);
        return res.status(500).json({ error: `Failed to stop ${config.name}.`, details: error.message });
      }
      console.log(`${config.name} (PID: ${childProcess.pid}) stopped.`);
      runningProcesses.delete(id);
      res.json({ message: `${config.name} stopped.`, status: 'Stopped' });
    });
  } catch (error) {
    console.error(`Error stopping ${config.name}:`, error);
    res.status(500).json({ error: `Failed to stop ${config.name}.`, details: error.message });
  }
});

app.get('/api/processes/status/:id', async (req, res) => {
  const { id } = req.params;
  const config = processConfig[id];
  if (!config) {
    return res.status(404).json({ error: 'Process not found' });
  }
  const status = await getProcessStatus(id);
  res.json({ id, name: config.name, status });
});

app.get('/api/processes/allStatus', async (req, res) => {
  const allStatuses = {};
  for (const id in processConfig) {
    const status = await getProcessStatus(id);
    allStatuses[id] = { name: processConfig[id].name, status };
  }
  res.json(allStatuses);
});

// --- Existing API Endpoints ---

// --- Helper CRUD API Endpoints ---

// Endpoint to get all helpers from the database
app.get('/api/helpers', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM helpers ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error('Error querying helpers from database:', err);
    res.status(500).json({ error: 'Failed to get helpers' });
  }
});

// Endpoint to add a new helper
app.post('/api/helpers', async (req, res) => {
  const { id, name, description, command, args, cwd } = req.body;
  if (!id || !name || !command || !args || !cwd) {
    return res.status(400).json({ error: 'Missing required fields for helper.' });
  }
  try {
    const query = 'INSERT INTO helpers(id, name, description, command, args, cwd) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [id, name, description, command, JSON.stringify(args), cwd];
    const { rows } = await pool.query(query, values);
    await loadProcessConfigFromDb(); // Reload config to include the new helper
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error adding new helper:', err);
    res.status(500).json({ error: 'Failed to add helper.' });
  }
});

// Endpoint to update an existing helper
app.put('/api/helpers/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, command, args, cwd } = req.body;
  if (!name || !command || !args || !cwd) {
    return res.status(400).json({ error: 'Missing required fields for helper.' });
  }
  try {
    const query = 'UPDATE helpers SET name = $1, description = $2, command = $3, args = $4, cwd = $5 WHERE id = $6 RETURNING *';
    const values = [name, description, command, JSON.stringify(args), cwd, id];
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Helper not found.' });
    }
    await loadProcessConfigFromDb(); // Reload config to reflect the update
    res.json(rows[0]);
  } catch (err) {
    console.error(`Error updating helper ${id}:`, err);
    res.status(500).json({ error: 'Failed to update helper.' });
  }
});

// Endpoint to delete a helper
app.delete('/api/helpers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM helpers WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Helper not found.' });
    }
    await loadProcessConfigFromDb(); // Reload config to remove the deleted helper
    res.status(204).send(); // No content
  } catch (err) {
    console.error(`Error deleting helper ${id}:`, err);
    res.status(500).json({ error: 'Failed to delete helper.' });
  }
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
        return null;
      }
    }).filter(Boolean);
    res.json(messages);
  });
});

// ... (other message-related endpoints remain the same for now)

// --- Server Startup ---
const startServer = async () => {
  try {
    await initializeDatabase();
    await loadProcessConfigFromDb();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server and all child processes...');
  const killPromises = [];
  runningProcesses.forEach((child, id) => {
    console.log(`Stopping ${processConfig[id].name} (PID: ${child.pid})...`);
    const promise = new Promise((resolve, reject) => {
      exec(`taskkill /PID ${child.pid} /F /T`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Failed to kill process ${child.pid}:`, error);
          reject(error);
        } else {
          console.log(`Process ${child.pid} killed.`);
          resolve();
        }
      });
    });
    killPromises.push(promise);
  });

  Promise.all(killPromises)
    .then(() => pool.end()) // Close the database connection pool
    .catch(err => console.error("Error during shutdown:", err))
    .finally(() => {
      console.log("All child processes stopped and database pool closed.");
      process.exit(0);
    });
});

    if (newConfig.frontend) newConfig.frontend.statusCheck = genericStatusCheck;
    if (newConfig.mediator) newConfig.mediator.statusCheck = genericStatusCheck;


    processConfig = newConfig;
    console.log('Successfully loaded process configuration from helpers.json');
  } catch (error) {
    console.error('Failed to load or parse helpers.json:', error);
    // Exit or use a default config if the manifest is critical
    process.exit(1); 
  }
};

// --- Helper Functions for Process Management ---
const getProcessStatus = async (id) => {
  const config = processConfig[id];
  if (!config) return 'Unknown';

  const childProcess = runningProcesses.get(id);
  if (!childProcess || childProcess.killed) {
    return 'Stopped';
  }

  // Use the specific statusCheck function if available, otherwise default to checking PID
  if (config.statusCheck) {
    return await config.statusCheck(childProcess.pid);
  } else {
    return new Promise(resolve => {
      exec(`tasklist /FI "PID eq ${childProcess.pid}"`, (err, stdout) => {
        if (stdout.includes(String(childProcess.pid))) {
          resolve('Running');
        } else {
          resolve('Stopped');
        }
      });
    });
  }
};

// --- Process Management API Endpoints ---

// Endpoint to get the list of all manageable processes
app.get('/api/processes', (req, res) => {
  // Return a simplified version of the config without sensitive details
  const clientSafeConfig = Object.values(processConfig).map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
  }));
  res.json(clientSafeConfig);
});

app.post('/api/processes/start/:id', async (req, res) => {
  const { id } = req.params;
  const config = processConfig[id];

  if (!config) {
    return res.status(404).json({ error: 'Process not found' });
  }

  if (runningProcesses.has(id)) {
    const status = await getProcessStatus(id);
    if (status === 'Running') {
      return res.status(400).json({ message: `${config.name} is already running.` });
    }
  }

  try {
    // Use 'spawn' for long-running processes
    const child = spawn(config.command, config.args, {
      cwd: config.cwd,
      detached: true, // Detach the child process from the parent
      stdio: 'ignore', // Ignore stdio for detached processes
      shell: true // Use shell to allow commands like 'npm start'
    });

    child.unref(); // Allow the parent to exit independently of the child

    runningProcesses.set(id, child);
    console.log(`${config.name} started with PID: ${child.pid}`);

    // Give it a moment to start and then check status
    setTimeout(async () => {
      const status = await getProcessStatus(id);
      res.json({ message: `${config.name} started.`, status, pid: child.pid });
    }, 2000); // Wait 2 seconds for the process to initialize

  } catch (error) {
    console.error(`Error starting ${config.name}:`, error);
    res.status(500).json({ error: `Failed to start ${config.name}.`, details: error.message });
  }
});

app.post('/api/processes/stop/:id', async (req, res) => {
  const { id } = req.params;
  const config = processConfig[id];

  if (!config) {
    return res.status(404).json({ error: 'Process not found' });
  }

  const childProcess = runningProcesses.get(id);

  if (!childProcess) {
    return res.status(400).json({ message: `${config.name} is not running (no tracked PID).` });
  }

  try {
    // On Windows, taskkill is more reliable for killing detached processes
    exec(`taskkill /PID ${childProcess.pid} /F /T`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error killing process ${childProcess.pid} for ${config.name}:`, error);
        return res.status(500).json({ error: `Failed to stop ${config.name}.`, details: error.message });
      }
      console.log(`${config.name} (PID: ${childProcess.pid}) stopped.`);
      runningProcesses.delete(id);
      res.json({ message: `${config.name} stopped.`, status: 'Stopped' });
    });

  } catch (error) {
    console.error(`Error stopping ${config.name}:`, error);
    res.status(500).json({ error: `Failed to stop ${config.name}.`, details: error.message });
  }
});

app.get('/api/processes/status/:id', async (req, res) => {
  const { id } = req.params;
  const config = processConfig[id];

  if (!config) {
    return res.status(404).json({ error: 'Process not found' });
  }

  const status = await getProcessStatus(id);
  res.json({ id, name: config.name, status });
});

app.get('/api/processes/allStatus', async (req, res) => {
  const allStatuses = {};
  for (const id in processConfig) {
    const status = await getProcessStatus(id);
    allStatuses[id] = { name: processConfig[id].name, status };
  }
  res.json(allStatuses);
});

// --- Existing API Endpoints (from previous index.js content) ---

// Endpoint to get all helpers
app.get('/api/helpers', async (req, res) => {
  try {
    const entries = await fs.promises.readdir(helpersDir, { withFileTypes: true });
    const helpers = await Promise.all(entries
      .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('the_'))
      .map(async (dirent) => {
        const helperName = dirent.name;
        const aboutFilePath = path.join(helpersDir, helperName, 'about.md');
        let description = 'No description available.';
        try {
          description = await fs.promises.readFile(aboutFilePath, 'utf8');
        } catch (readErr) {
          // If about.md doesn't exist, use default description
          if (readErr.code !== 'ENOENT') {
            console.warn(`Could not read about.md for ${helperName}:`, readErr);
          }
        }
        return { name: helperName, description };
      }));
    res.json(helpers);
  } catch (err) {
    console.error('Error reading helpers directory:', err);
    res.status(500).json({ error: 'Failed to read helpers' });
  }
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

// Endpoint to get all messages from all helper inboxes
app.get('/api/messages/all', async (req, res) => {
  try {
    const allMessages = [];
    const helperDirs = await fs.promises.readdir(commonRoomDir, { withFileTypes: true });

    for (const dirent of helperDirs) {
      if (dirent.isDirectory()) {
        const inboxPath = path.join(commonRoomDir, dirent.name, 'inbox');
        try {
          const messageFiles = await fs.promises.readdir(inboxPath);
          for (const file of messageFiles) {
            if (file.endsWith('.json')) {
              const filePath = path.join(inboxPath, file);
              try {
                const content = await fs.promises.readFile(filePath, 'utf8');
                allMessages.push(JSON.parse(content));
              } catch (parseErr) {
                console.warn(`Error parsing message file ${filePath}:`, parseErr);
              }
            }
          }
        } catch (inboxErr) {
          // Ignore if inbox directory doesn't exist for a helper
          if (inboxErr.code !== 'ENOENT') {
            console.warn(`Error reading inbox for ${dirent.name}:`, inboxErr);
          }
        }
      }
    }

    // Sort messages by timestamp
    allMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    res.json(allMessages);
  } catch (err) {
    console.error('Error fetching all messages:', err);
    res.status(500).json({ error: 'Failed to fetch all messages' });
  }
});

loadProcessConfig();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});