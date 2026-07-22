const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "..", "data", "notes.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("✖ Failed to connect to SQLite database.");
    console.error(err.message);
    process.exit(1);
  }

  console.log("✔ Connected to SQLite database.");
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY,
      text TEXT NOT NULL,
      priority TEXT NOT NULL,
      tags TEXT,
      dueDate TEXT,
      recurrence TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL
    )
  `);
});

module.exports = db;
