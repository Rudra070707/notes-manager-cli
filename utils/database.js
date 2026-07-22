const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../data/notes.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("✖ Failed to connect to SQLite database.");
    console.error(err.message);
  } else {
    console.log("✔ Connected to SQLite database.");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      priority TEXT DEFAULT 'medium',
      tags TEXT DEFAULT '',
      dueDate TEXT,
      recurrence TEXT,
      completed INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL
    )
  `);
});

module.exports = db;
