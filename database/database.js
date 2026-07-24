const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '..', 'data', 'notes.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('✖ Failed to connect to SQLite database.');
    console.error(err.message);
    process.exit(1);
  }

  console.log('✔ Connected to SQLite database.');
});

db.serialize(() => {
  // =========================
  // Notes Table
  // =========================
  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY,
      text TEXT NOT NULL,
      priority TEXT NOT NULL,
      tags TEXT,
      dueDate TEXT,
      recurrence TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      archived INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL
    )
  `);

  // =========================
  // Undo History Table
  // =========================
  db.run(`
    CREATE TABLE IF NOT EXISTS undo_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      operation TEXT NOT NULL,
      payload TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  // =========================
  // Migration: Add archived column if missing
  // =========================
  db.all('PRAGMA table_info(notes)', (err, columns) => {
    if (err) {
      console.error(err.message);
      return;
    }

    const hasArchived = columns.some((column) => column.name === 'archived');

    if (!hasArchived) {
      db.run(
        'ALTER TABLE notes ADD COLUMN archived INTEGER NOT NULL DEFAULT 0',
        (alterErr) => {
          if (alterErr) {
            console.error(alterErr.message);
          } else {
            console.log('✔ Database migrated: archived column added.');
          }
        }
      );
    }
  });

  // =========================
  // Migration: Ensure undo_history table exists
  // =========================
  db.run(`
    CREATE TABLE IF NOT EXISTS undo_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      operation TEXT NOT NULL,
      payload TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);
});

module.exports = db;
