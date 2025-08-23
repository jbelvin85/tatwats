const { pool, initializeDatabase } = require('../database'); // Assuming database.js exports pool and initializeDatabase
const { Client } = require('pg'); // Directly import Client for setup/teardown

// Load test environment variables
require('dotenv').config({ path: './.env.test' });

// Function to wait for the database to be ready
async function waitForDb(clientConfig, maxRetries = 10, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const client = new Client(clientConfig);
      await client.connect();
      await client.query('SELECT 1'); // Simple query to check connection
      await client.end();
      console.log(`[Test Setup] Database ready after ${i + 1} retries.`);
      return;
    } catch (error) {
      console.log(`[Test Setup] Waiting for database... Attempt ${i + 1}/${maxRetries}. Error: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Database not ready within the specified time.');
}

describe('Database Integration Tests', () => {
  let client;

  // Before all tests in this suite, set up the test database
  beforeAll(async () => {
    // Configuration for connecting to the maintenance database
    const maintenanceClientConfig = {
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      database: 'postgres', // Connect to the maintenance database
    };

    // Wait for the maintenance database to be ready
    await waitForDb(maintenanceClientConfig);

    client = new Client(maintenanceClientConfig);
    await client.connect();

    // Drop and recreate the test database
    console.log(`[Test Setup] Dropping and recreating test database: ${process.env.PGDATABASE}`);
    await client.query(`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${process.env.PGDATABASE}'`);
    await client.query(`DROP DATABASE IF EXISTS "${process.env.PGDATABASE}"`);
    await client.query(`CREATE DATABASE "${process.env.PGDATABASE}"`);
    await client.end(); // Disconnect from maintenance database

    // Now, initialize the schema in the newly created test database
    // This uses the application's database.js logic
    await initializeDatabase();
    console.log('[Test Setup] Test database initialized with schema.');
  }, 30000); // Increase timeout for beforeAll hook to allow for Docker startup

  // After all tests in this suite, clean up the test database
  afterAll(async () => {
    // Close the application's database pool
    // Call pool() to get the initialized pool instance before calling .end()
    await pool().end(); // <--- CHANGE IS HERE
    console.log('[Test Teardown] Application database pool closed.');

    // Optionally, drop the test database again for complete cleanup
    const maintenanceClientConfig = {
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      database: 'postgres', // Connect to the maintenance database
    };
    client = new Client(maintenanceClientConfig);
    await client.connect();
    console.log(`[Test Teardown] Dropping test database: ${process.env.PGDATABASE}`);
    await client.query(`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${process.env.PGDATABASE}'`);
    await client.query(`DROP DATABASE IF EXISTS "${process.env.PGDATABASE}"`);
    await client.end();
    console.log('[Test Teardown] Test database dropped.');
  }, 10000); // Increase timeout for afterAll hook

    it('should successfully connect to the PostgreSQL test database', async () => {
    const result = await pool().query('SELECT 1+1 AS solution');
    expect(result.rows[0].solution).toBe(2);
  });

  describe('User Operations (CRUD)', () => {
    // Helper function to create a user for tests
    const createUser = async (name) => {
      const result = await pool().query(
        'INSERT INTO users(name) VALUES($1) RETURNING id, name, created_at',
        [name]
      );
      return result.rows[0];
    };

    // Helper function to clean up users after tests
    const deleteAllUsers = async () => {
      await pool().query('DELETE FROM users');
    };

    beforeEach(async () => {
      // Clean up users before each test to ensure test isolation
      await deleteAllUsers();
    });

    it('should create a new user', async () => {
      const userName = 'test_user_create';
      const user = await createUser(userName);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.name).toBe(userName);
      expect(user.created_at).toBeDefined();
    });

    it('should read a user by ID', async () => {
      const createdUser = await createUser('test_user_read');
      const result = await pool().query('SELECT id, name FROM users WHERE id = $1', [createdUser.id]);
      const foundUser = result.rows[0];

      expect(foundUser).toBeDefined();
      expect(foundUser.id).toBe(createdUser.id);
      expect(foundUser.name).toBe(createdUser.name);
    });

    it('should update an existing user', async () => {
      const createdUser = await createUser('test_user_update_old');
      const newName = 'test_user_update_new';

      const result = await pool().query(
        'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name',
        [newName, createdUser.id]
      );
      const updatedUser = result.rows[0];

      expect(updatedUser).toBeDefined();
      expect(updatedUser.id).toBe(createdUser.id);
      expect(updatedUser.name).toBe(newName);
    });

    it('should delete a user', async () => {
      const userToDelete = await createUser('test_user_delete');
      const result = await pool().query('DELETE FROM users WHERE id = $1 RETURNING id', [userToDelete.id]);

      expect(result.rowCount).toBe(1);
      expect(result.rows[0].id).toBe(userToDelete.id);

      // Verify deletion
      const verifyResult = await pool().query('SELECT * FROM users WHERE id = $1', [userToDelete.id]);
      expect(verifyResult.rows.length).toBe(0);
    });
  });

  describe('Message Operations (CRUD)', () => {
    // Helper function to create a user (needed for message sender/receiver)
    const createUser = async (name) => {
      const result = await pool().query(
        'INSERT INTO users(name) VALUES($1) RETURNING id, name, created_at',
        [name]
      );
      return result.rows[0];
    };

    // Helper function to create a conversation (needed for messages)
    const createConversation = async (name = null, type = 'direct') => {
      const result = await pool().query(
        'INSERT INTO conversations(name, type) VALUES($1, $2) RETURNING id, name, type, created_at',
        [name, type]
      );
      return result.rows[0];
    };

    // Helper function to create a message
    const createMessage = async (conversationId, senderId, content) => {
      const result = await pool().query(
        'INSERT INTO messages(conversation_id, sender_id, content) VALUES($1, $2, $3) RETURNING id, conversation_id, sender_id, content, timestamp',
        [conversationId, senderId, content]
      );
      return result.rows[0];
    };

    // Helper function to clean up messages, conversations, and users
    const cleanAllMessageRelatedTables = async () => {
      await pool().query('DELETE FROM messages');
      await pool().query('DELETE FROM conversation_participants'); // Ensure this table is empty if it exists
      await pool().query('DELETE FROM conversations');
      await pool().query('DELETE FROM users');
    };

    let testUser1, testUser2, testConversation;

    beforeEach(async () => {
      // Clean up all related tables before each message test
      await cleanAllMessageRelatedTables();

      // Create necessary entities for message tests
      testUser1 = await createUser('message_sender');
      testUser2 = await createUser('message_receiver');
      testConversation = await createConversation('test_conv');
    });

    it('should create a new message', async () => {
      const messageContent = 'Hello from sender!';
      const message = await createMessage(testConversation.id, testUser1.id, messageContent);

      expect(message).toBeDefined();
      expect(message.id).toBeDefined();
      expect(message.conversation_id).toBe(testConversation.id);
      expect(message.sender_id).toBe(testUser1.id);
      expect(message.content).toBe(messageContent);
      expect(message.timestamp).toBeDefined();
    });

    it('should read messages by conversation ID', async () => {
      await createMessage(testConversation.id, testUser1.id, 'Message 1');
      await createMessage(testConversation.id, testUser2.id, 'Message 2');
      await createMessage(testConversation.id, testUser1.id, 'Message 3');

      const result = await pool().query('SELECT * FROM messages WHERE conversation_id = $1 ORDER BY timestamp', [testConversation.id]);
      const messages = result.rows;

      expect(messages.length).toBe(3);
      expect(messages[0].content).toBe('Message 1');
      expect(messages[1].content).toBe('Message 2');
      expect(messages[2].content).toBe('Message 3');
    });

    it('should update an existing message', async () => {
      const originalMessage = await createMessage(testConversation.id, testUser1.id, 'Original content');
      const updatedContent = 'Updated content!';

      const result = await pool().query(
        'UPDATE messages SET content = $1 WHERE id = $2 RETURNING id, content',
        [updatedContent, originalMessage.id]
      );
      const message = result.rows[0];

      expect(message).toBeDefined();
      expect(message.id).toBe(originalMessage.id);
      expect(message.content).toBe(updatedContent);

      // Verify by reading again
      const verifyResult = await pool().query('SELECT content FROM messages WHERE id = $1', [originalMessage.id]);
      expect(verifyResult.rows[0].content).toBe(updatedContent);
    });

    it('should delete a message', async () => {
      const messageToDelete = await createMessage(testConversation.id, testUser1.id, 'Message to delete');
      const result = await pool().query('DELETE FROM messages WHERE id = $1 RETURNING id', [messageToDelete.id]);

      expect(result.rowCount).toBe(1);
      expect(result.rows[0].id).toBe(messageToDelete.id);

      // Verify deletion
      const verifyResult = await pool().query('SELECT * FROM messages WHERE id = $1', [messageToDelete.id]);
      expect(verifyResult.rows.length).toBe(0);
    });
  });

  describe('Conversation Operations (CRUD)', () => {
    // Helper function to create a conversation
    const createConversation = async (name = null, type = 'direct') => {
      const result = await pool().query(
        'INSERT INTO conversations(name, type) VALUES($1, $2) RETURNING id, name, type, created_at',
        [name, type]
      );
      return result.rows[0];
    };

    // Helper function to clean up conversations
    const deleteAllConversations = async () => {
      // Need to delete from conversation_participants first due to foreign key constraint
      await pool().query('DELETE FROM conversation_participants');
      await pool().query('DELETE FROM conversations');
    };

    beforeEach(async () => {
      await deleteAllConversations();
    });

    it('should create a new conversation', async () => {
      const convName = 'Test Conversation';
      const conversation = await createConversation(convName, 'group');

      expect(conversation).toBeDefined();
      expect(conversation.id).toBeDefined();
      expect(conversation.name).toBe(convName);
      expect(conversation.type).toBe('group');
      expect(conversation.created_at).toBeDefined();
    });

    it('should read a conversation by ID', async () => {
      const createdConv = await createConversation('Read Conv');
      const result = await pool().query('SELECT id, name, type FROM conversations WHERE id = $1', [createdConv.id]);
      const foundConv = result.rows[0];

      expect(foundConv).toBeDefined();
      expect(foundConv.id).toBe(createdConv.id);
      expect(foundConv.name).toBe(createdConv.name);
      expect(foundConv.type).toBe(createdConv.type);
    });

    it('should update an existing conversation', async () => {
      const createdConv = await createConversation('Old Name', 'direct');
      const newName = 'New Name';
      const newType = 'group';

      const result = await pool().query(
        'UPDATE conversations SET name = $1, type = $2 WHERE id = $3 RETURNING id, name, type',
        [newName, newType, createdConv.id]
      );
      const updatedConv = result.rows[0];

      expect(updatedConv).toBeDefined();
      expect(updatedConv.id).toBe(createdConv.id);
      expect(updatedConv.name).toBe(newName);
      expect(updatedConv.type).toBe(newType);
    });

    it('should delete a conversation', async () => {
      const convToDelete = await createConversation('Delete Me');
      // Ensure no participants before deleting conversation
      await pool().query('DELETE FROM conversation_participants WHERE conversation_id = $1', [convToDelete.id]);
      const result = await pool().query('DELETE FROM conversations WHERE id = $1 RETURNING id', [convToDelete.id]);

      expect(result.rowCount).toBe(1);
      expect(result.rows[0].id).toBe(convToDelete.id);

      // Verify deletion
      const verifyResult = await pool().query('SELECT * FROM conversations WHERE id = $1', [convToDelete.id]);
      expect(verifyResult.rows.length).toBe(0);
    });
  });

  describe('Conversation Participant Operations (CRUD)', () => {
    // Helper functions (re-using or defining as needed)
    const createUser = async (name) => {
      const result = await pool().query(
        'INSERT INTO users(name) VALUES($1) RETURNING id, name, created_at',
        [name]
      );
      return result.rows[0];
    };

    const createConversation = async (name = null, type = 'direct') => {
      const result = await pool().query(
        'INSERT INTO conversations(name, type) VALUES($1, $2) RETURNING id, name, type, created_at',
        [name, type]
      );
      return result.rows[0];
    };

    const addParticipant = async (conversationId, userId) => {
      const result = await pool().query(
        'INSERT INTO conversation_participants(conversation_id, user_id) VALUES($1, $2) RETURNING conversation_id, user_id, joined_at',
        [conversationId, userId]
      );
      return result.rows[0];
    };

    // Helper function to clean up all related tables
    const cleanAllRelatedTables = async () => {
      await pool().query('DELETE FROM messages'); // Clear messages first
      await pool().query('DELETE FROM conversation_participants');
      await pool().query('DELETE FROM conversations');
      await pool().query('DELETE FROM users');
    };

    let testUser, testConversation;

    beforeEach(async () => {
      await cleanAllRelatedTables();
      testUser = await createUser('participant_user');
      testConversation = await createConversation('participant_conv');
    });

    it('should add a participant to a conversation', async () => {
      const participant = await addParticipant(testConversation.id, testUser.id);

      expect(participant).toBeDefined();
      expect(participant.conversation_id).toBe(testConversation.id);
      expect(participant.user_id).toBe(testUser.id);
      expect(participant.joined_at).toBeDefined();
    });

    it('should read participants for a conversation', async () => {
      const user1 = await createUser('user1');
      const user2 = await createUser('user2');
      await addParticipant(testConversation.id, user1.id);
      await addParticipant(testConversation.id, user2.id);

      const result = await pool().query('SELECT user_id FROM conversation_participants WHERE conversation_id = $1', [testConversation.id]);
      const participants = result.rows.map(row => row.user_id);

      expect(participants).toEqual(expect.arrayContaining([user1.id, user2.id]));
      expect(participants.length).toBe(2);
    });

    it('should remove a participant from a conversation', async () => {
      await addParticipant(testConversation.id, testUser.id);
      const result = await pool().query('DELETE FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2 RETURNING *', [testConversation.id, testUser.id]);

      expect(result.rowCount).toBe(1);
      expect(result.rows[0].conversation_id).toBe(testConversation.id);
      expect(result.rows[0].user_id).toBe(testUser.id);

      // Verify removal
      const verifyResult = await pool().query('SELECT * FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2', [testConversation.id, testUser.id]);
      expect(verifyResult.rows.length).toBe(0);
    });
  });
});