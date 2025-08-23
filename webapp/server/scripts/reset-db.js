const path = require('path');
// Load environment variables from .env file in the parent directory
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { Client } = require('pg');

const { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE } = process.env;

if (!PGUSER || !PGPASSWORD || !PGHOST || !PGPORT || !PGDATABASE) {
  console.error('❌ Error: Missing required PostgreSQL environment variables.');
  console.error('   Please ensure PGUSER, PGPASSWORD, PGHOST, PGPORT, and PGDATABASE are set in your .env file or environment.');
  process.exit(1);
}

// Function to initialize the database schema
async function initializeDatabase() {
    const pool = new Client({
        user: PGUSER,
        password: PGPASSWORD,
        host: PGHOST,
        port: PGPORT,
        database: PGDATABASE, // Connect to the specific database to create tables
    });
    try {
        await pool.connect();
        console.log('Connected to PostgreSQL database for schema initialization.');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS conversations (
                id SERIAL PRIMARY KEY,
                name TEXT UNIQUE, -- Added UNIQUE constraint
                type TEXT NOT NULL DEFAULT 'direct', -- 'direct' or 'group'
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS conversation_participants (
                conversation_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (conversation_id, user_id),
                FOREIGN KEY (conversation_id) REFERENCES conversations(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                conversation_id INTEGER NOT NULL,
                sender_id INTEGER NOT NULL,
                content TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (conversation_id) REFERENCES conversations(id),
                FOREIGN KEY (sender_id) REFERENCES users(id)
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS helpers (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                description TEXT,
                command TEXT NOT NULL,
                args JSONB, -- Store arguments as JSONB
                cwd TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Database schema created or updated.');
    } catch (err) {
        console.error('Error initializing database schema:', err);
        throw err;
    } finally {
        await pool.end();
    }
}

// Function to seed the database with initial data
async function seedDatabase() {
    const pool = new Client({
        user: PGUSER,
        password: PGPASSWORD,
        host: PGHOST,
        port: PGPORT,
        database: PGDATABASE, // Connect to the specific database to seed
    });
    try {
        await pool.connect();
        console.log('Seeding database with initial data...');

        // Insert a default user
        const userResult = await pool.query(
            'INSERT INTO users(name) VALUES($1) ON CONFLICT(name) DO NOTHING RETURNING id',
            ['default_user']
        );
        let defaultUserId;
        if (userResult.rows.length > 0) {
            defaultUserId = userResult.rows[0].id;
            console.log(`  - Default user 'default_user' created with ID: ${defaultUserId}`);
        } else {
            // If user already existed (due to ON CONFLICT), retrieve its ID
            const existingUser = await pool.query('SELECT id FROM users WHERE name = $1', ['default_user']);
            defaultUserId = existingUser.rows[0].id;
            console.log(`  - Default user 'default_user' already exists with ID: ${defaultUserId}`);
        }


        // Insert a default conversation
        const convResult = await pool.query(
            'INSERT INTO conversations(name, type) VALUES($1, $2) ON CONFLICT(name) DO NOTHING RETURNING id',
            ['General Chat', 'group']
        );
        let generalChatId;
        if (convResult.rows.length > 0) {
            generalChatId = convResult.rows[0].id;
            console.log(`  - Default conversation 'General Chat' created with ID: ${generalChatId}`);
        } else {
            // If conversation already existed, retrieve its ID
            const existingConv = await pool.query('SELECT id FROM conversations WHERE name = $1', ['General Chat']);
            generalChatId = existingConv.rows[0].id;
            console.log(`  - Default conversation 'General Chat' already exists with ID: ${generalChatId}`);
        }

        // Add default user to general chat
        await pool.query(
            'INSERT INTO conversation_participants(conversation_id, user_id) VALUES($1, $2) ON CONFLICT (conversation_id, user_id) DO NOTHING',
            [generalChatId, defaultUserId]
        );
        console.log(`  - Default user added to 'General Chat'.`);

        console.log('Database seeding complete.');
    } catch (err) {
        console.error('Error seeding database:', err.stack);
        throw err;
    } finally {
        await pool.end();
    }
}

const run = async () => {
  // Connect to the default 'postgres' database to be able to drop/create our target database
  const client = new Client({
    user: PGUSER,
    password: PGPASSWORD,
    host: PGHOST,
    port: PGPORT,
    database: 'postgres', // Connect to the maintenance database
  });

  try {
    await client.connect();
    console.log('🚀 Connected to PostgreSQL server (maintenance database).');

    // 1. Drop the database if it exists
    console.log(`   - Checking for database "${PGDATABASE}"...`);
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [PGDATABASE]);
    if (res.rowCount > 0) {
      console.log(`   - Database "${PGDATABASE}" found. Terminating connections and dropping...`);
      await client.query(`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1`, [PGDATABASE]);
      await client.query(`DROP DATABASE "${PGDATABASE}"`);
      console.log(`   - Database "${PGDATABASE}" dropped successfully.`);
    } else {
      console.log(`   - Database "${PGDATABASE}" not found. Skipping drop.`);
    }

    // 2. Create the new database
    console.log(`   - Creating database "${PGDATABASE}"...`);
    await client.query(`CREATE DATABASE "${PGDATABASE}"`);
    console.log('✅ Database created.');

  } catch (err) {
    console.error('❌ An error occurred during database drop/create:', err.stack);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Disconnected from PostgreSQL server (maintenance database).');
  }

  // 3. Initialize schema and seed data in the newly created database
  try {
    await initializeDatabase(); // Initialize schema
    await seedDatabase();       // Seed data
    console.log('✅ Database reset and seeding complete!');
  } catch (err) {
    console.error('❌ An error occurred during schema initialization or seeding:', err.stack);
    process.exit(1);
  }
};

run();