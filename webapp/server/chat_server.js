
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database'); // Initialize database and schema

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

// Basic route for testing server
app.get('/', (req, res) => {
    res.send('Chat server is running!');
});

// Import and use API routes
const chatRoutes = require('./routes');
app.use('/api', chatRoutes);

app.listen(PORT, () => {
    console.log(`Chat server listening on port ${PORT}`);
});
