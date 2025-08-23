const { Pool } = require('pg');

let pool; // Declare pool but don't initialize immediately

function initPool() {
    if (pool) {
        return pool; // Return existing pool if already initialized
    }
    pool = new Pool({
        user: process.env.PGUSER || 'user',
        host: process.env.PGHOST || 'localhost',
        database: process.env.PGDATABASE || 'tatwats', // A new database for chat
        password: process.env.PGPASSWORD || 'password',
        port: process.env.PGPORT || 5432,
    });

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err);
        // In a real app, you might want to gracefully shut down or restart
        // For tests, we'll let the test runner handle errors
    });
    return pool;
}

async function initializeDatabase() {
    const currentPool = initPool(); // Ensure pool is initialized
    try {
        const client = await currentPool.connect();
        console.log('Connected to PostgreSQL database.');

        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                role TEXT DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS conversations (
                id SERIAL PRIMARY KEY,
                name TEXT, -- For group chat names, optional for direct messages
                type TEXT NOT NULL DEFAULT 'direct', -- 'direct' or 'group'
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS conversation_participants (
                conversation_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (conversation_id, user_id),
                FOREIGN KEY (conversation_id) REFERENCES conversations(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `);

        await client.query(`
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

        await client.query(`
            CREATE TABLE IF NOT EXISTS helpers (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                description TEXT,
                command TEXT NOT NULL,
                core_args JSONB DEFAULT '[]',
                user_args JSONB DEFAULT '[]',
                cwd TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Database schema created or updated.');
        client.release();
    } catch (err) {
        console.error('Error initializing database:', err);
        throw err; // Throw the error so the caller can handle it
    }
}

// initializeDatabase();

module.exports = {
    query: (text, params) => initPool().query(text, params),
    getClient: () => initPool().connect(),
    initializeDatabase: initializeDatabase, // Export initializeDatabase
    pool: initPool, // Export initPool as pool, so tests can call it
};