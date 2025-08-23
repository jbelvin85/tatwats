require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { pool, initializeDatabase } = require('./database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Logging middleware for all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// --- API Routes ---
app.use('/api', require('./routes')); // Mount the routes from routes.js

// --- Server Startup ---
const startServer = async () => {
  try {
    await initializeDatabase();
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
  console.log('SIGINT received. Shutting down gracefully...');
  pool.end()
    .then(() => {
      console.log('Database pool has been closed.');
      process.exit(0);
    })
    .catch(err => console.error("Error during shutdown:", err))
});