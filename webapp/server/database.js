
require('dotenv').config({ path: '../../.env' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Check for required environment variables
if (!process.env.PGHOST || !process.env.PGUSER || !process.env.PGPASSWORD || !process.env.PGDATABASE || !process.env.PGPORT) {
    console.error('Missing one or more required PostgreSQL environment variables (PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT)');
    process.exit(1);
}

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

const createHelpersTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS helpers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      command TEXT NOT NULL,
      args JSONB,
      cwd TEXT NOT NULL
    );
  `;
  try {
    await pool.query(queryText);
    console.log('Table "helpers" is ready.');
  } catch (err) {
    console.error('Error creating helpers table:', err.stack);
    throw err; // Propagate error to stop initialization
  }
};

const seedHelpersData = async () => {
    const client = await pool.connect();
    try {
        // Check if the table is empty
        const res = await client.query('SELECT COUNT(*) FROM helpers');
        if (res.rows[0].count > 0) {
            console.log('Helpers table already contains data. Seeding skipped.');
            return;
        }

        // Read data from helpers.json
        const manifestPath = path.join(__dirname, '../../helpers.json');
        const manifestData = fs.readFileSync(manifestPath, 'utf8');
        const helpers = JSON.parse(manifestData);

        // Insert each helper into the database
        console.log('Seeding helpers table...');
        for (const helper of helpers) {
            const insertQuery = 'INSERT INTO helpers (id, name, description, command, args, cwd) VALUES ($1, $2, $3, $4, $5, $6)';
            const values = [
                helper.id,
                helper.name,
                helper.description,
                helper.command,
                JSON.stringify(helper.args), // Convert args array to JSON string for JSONB
                helper.cwd
            ];
            await client.query(insertQuery, values);
        }
        console.log('Successfully seeded helpers table.');

    } catch (err) {
        console.error('Error seeding helpers data:', err.stack);
        throw err;
    } finally {
        client.release();
    }
};

const initializeDatabase = async () => {
    try {
        await createHelpersTable();
        await seedHelpersData();
        console.log('Database initialization completed successfully.');
    } catch (err) {
        console.error('Failed to initialize the database. Exiting.');
        process.exit(1);
    }
};

module.exports = {
    pool,
    initializeDatabase
}; 
