const pool = require('../backend/db/pool');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

async function getUserByUsername(username) {
    const result = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
    );
    return result.rows[0] || null;
}

async function insertUser(username, email, password) {
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
        [username, email, password_hash]
    );
    return result.rows[0];
}

module.exports = { getUserByUsername, insertUser };