const path =require('path');
// Load environment variables from .env file in the parent directory
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { Client } = require('pg');

const { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE } = process.env;

if (!PGUSER || !PGPASSWORD || !PGHOST || !PGPORT || !PGDATABASE) {
  console.error('❌ Error: Missing required PostgreSQL environment variables.');
  console.error('   Please ensure PGUSER, PGPASSWORD, PGHOST, PGPORT, and PGDATABASE are set in your .env file or environment.');
  process.exit(1);
}

const run = async () => {
  // Connect to the default 'postgres' database to be able to drop/create our target database
  const client = new Client({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: 'postgres', // Connect to the maintenance database
  });

  try {
    await client.connect();
    console.log('🚀 Connected to PostgreSQL server.');

    // 1. Drop the database if it exists
    console.log(`   - Checking for database "${DB_NAME}"...`);
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [DB_NAME]);
    if (res.rowCount > 0) {
      console.log(`   - Database "${DB_NAME}" found. Terminating connections and dropping...`);
      await client.query(`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1`, [DB_NAME]);
      await client.query(`DROP DATABASE "${DB_NAME}"`);
      console.log(`   - Database "${DB_NAME}" dropped successfully.`);
    } else {
      console.log(`   - Database "${DB_NAME}" not found. Skipping drop.`);
    }

    // 2. Create the new database
    console.log(`   - Creating database "${DB_NAME}"...`);
    await client.query(`CREATE DATABASE "${DB_NAME}"`);
    console.log('✅ Database reset complete! You now have a fresh database.');

  } catch (err) {
    console.error('❌ An error occurred during database reset:', err.stack);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Disconnected from PostgreSQL server.');
  }
};

run();