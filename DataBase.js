const Database = require('better-sqlite3');
const { DATABASE_URL } = require('./config.json');

// Open a new database connection
const db = new Database(DATABASE_URL);

// Create a new users table if it doesn't exist
// id: Primary key, auto-incremented by default
// username: Meta username
// password: Meta password
// minecraft_nick: Minecraft username
// discord_id: Discord user ID

db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT,
    minecraft_nick TEXT,
    discord_id TEXT
)`);

module.exports = { db };