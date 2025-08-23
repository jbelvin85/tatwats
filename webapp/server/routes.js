const express = require('express');
const router = express.Router();
const db = require('./database');

// Create a new user
router.post('/users', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'User name is required' });
    }
    try {
        const result = await db.query('INSERT INTO users (name) VALUES ($1) RETURNING id', [name]);
        res.status(201).json({ id: result.rows[0].id, name: name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const result = await db.query('SELECT id, name, role FROM users');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single user by ID
router.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT id, name FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a user by ID
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, role } = req.body; // Now accepting role
    
    // Build the SET clause dynamically based on what's provided
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
        updates.push(`name = ${paramIndex++}`);
        values.push(name);
    }
    if (role !== undefined) {
        updates.push(`role = ${paramIndex++}`);
        values.push(role);
    }

    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update provided' });
    }

    values.push(id); // Add id as the last parameter

    try {
        const result = await db.query(
            `UPDATE users SET ${updates.join(', ')} WHERE id = ${paramIndex} RETURNING id, name, role`,
            values
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a user by ID
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(204).send(); // No content for successful deletion
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new conversation (supports direct and group)
router.post('/conversations', async (req, res) => {
    const { name, type, participant_ids } = req.body; // participant_ids is an array of user IDs

    if (type === 'direct') {
        if (!participant_ids || participant_ids.length !== 2) {
            return res.status(400).json({ error: 'Direct conversation requires exactly two participant_ids' });
        }
    } else if (type === 'group') {
        if (!name || !participant_ids || participant_ids.length < 2) {
            return res.status(400).json({ error: 'Group conversation requires a name and at least two participant_ids' });
        }
    } else {
        return res.status(400).json({ error: 'Invalid conversation type. Must be \'direct\' or \'group\'' });
    }

    let client;
    try {
        client = await db.getClient();
        await client.query('BEGIN');

        const convResult = await client.query(
            'INSERT INTO conversations (name, type) VALUES ($1, $2) RETURNING id',
            [name, type]
        );
        const conversationId = convResult.rows[0].id;

        for (const userId of participant_ids) {
            await client.query(
                'INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2)',
                [conversationId, userId]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ id: conversationId, name, type, participant_ids });

    } catch (err) {
        if (client) {
            await client.query('ROLLBACK');
        }
        res.status(500).json({ error: err.message });
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Get all conversations
router.get('/conversations', async (req, res) => {
    try {
        const result = await db.query('SELECT id, name, type FROM conversations');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get messages for a conversation
router.get('/conversations/:id/messages', async (req, res) => {
    const conversation_id = req.params.id;
    try {
        const result = await db.query('SELECT * FROM messages WHERE conversation_id = $1 ORDER BY timestamp ASC', [conversation_id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Send a message
router.post('/messages', async (req, res) => {
    const { conversation_id, sender_id, content } = req.body;
    if (!conversation_id || !sender_id || !content) {
        return res.status(400).json({ error: 'Conversation ID, Sender ID, and Content are required' });
    }
    try {
        const result = await db.query('INSERT INTO messages (conversation_id, sender_id, content) VALUES ($1, $2, $3) RETURNING id', [conversation_id, sender_id, content]);
        res.status(201).json({ id: result.rows[0].id, conversation_id, sender_id, content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get total message count for statistics
router.get('/messages/count', async (req, res) => {
    try {
        const result = await db.query('SELECT COUNT(*) FROM messages');
        res.json({ count: parseInt(result.rows[0].count) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Server status endpoint
router.get('/status/server', (req, res) => {
    res.json({ status: 'online' });
});

// Get all helpers
router.get('/helpers', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM helpers ORDER BY name ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single helper by ID
router.get('/helpers/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM helpers WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Helper not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new helper
router.post('/helpers', async (req, res) => {
    console.log('Received helper POST request body:', req.body);
    const { id, name, description, command, args, cwd } = req.body;
    if (!id || !name || !command || !cwd) {
        return res.status(400).json({ error: 'ID, Name, Command, and CWD are required' });
    }
    try {
        const result = await db.query(
            'INSERT INTO helpers (id, name, description, command, args, cwd) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [id, name, description, command, args, cwd]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a helper by ID
router.put('/helpers/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, command, args, cwd } = req.body;
    if (!name || !command || !cwd) {
        return res.status(400).json({ error: 'Name, Command, and CWD are required' });
    }
    try {
        const result = await db.query(
            'UPDATE helpers SET name = $1, description = $2, command = $3, args = $4, cwd = $5 WHERE id = $6 RETURNING *',
            [name, description, command, args, cwd, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Helper not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a helper by ID
router.delete('/helpers/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM helpers WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Helper not found' });
        }
        res.status(204).send(); // No content for successful deletion
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;