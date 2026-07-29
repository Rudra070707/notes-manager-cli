const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// ======================================================
// Database Selection
// ======================================================

const dataDir = path.join(__dirname, '..', 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const isTest =
  process.env.NODE_ENV === 'test' ||
  process.argv.some((arg) => arg.includes('jest'));

const dbFile = isTest ? 'test-notes.db' : 'notes.db';

const dbPath = path.join(dataDir, dbFile);

// ======================================================
// SQLite Connection
// ======================================================

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('✖ Failed to connect to SQLite database.');
    console.error(err.message);
    process.exit(1);
  }

  console.log(`✔ Connected to SQLite database (${dbFile}).`);
});

// ======================================================
// Helper
// ======================================================

function addColumnIfNotExists(table, column, definition) {
  db.all(`PRAGMA table_info(${table})`, (err, columns) => {
    if (err) {
      console.error(err.message);
      return;
    }

    const exists = columns.some((c) => c.name === column);

    if (!exists) {
      db.run(
        `ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`,
        (alterErr) => {
          if (alterErr) {
            console.error(alterErr.message);
          } else {
            console.log(`✔ Database migrated: ${column} column added.`);
          }
        }
      );
    }
  });
}

// ======================================================
// Database Initialization
// ======================================================

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
      archived INTEGER NOT NULL DEFAULT 0,
      is_trashed INTEGER NOT NULL DEFAULT 0,
      is_locked INTEGER NOT NULL DEFAULT 0,
      is_pinned INTEGER NOT NULL DEFAULT 0,
      is_favorite INTEGER NOT NULL DEFAULT 0,
      category TEXT NOT NULL DEFAULT 'General',
      createdAt TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS undo_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      operation TEXT NOT NULL,
      payload TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  // ======================================================
  // Automatic Migrations
  // ======================================================

  addColumnIfNotExists('notes', 'archived', 'INTEGER NOT NULL DEFAULT 0');

  addColumnIfNotExists('notes', 'is_trashed', 'INTEGER NOT NULL DEFAULT 0');

  addColumnIfNotExists('notes', 'is_locked', 'INTEGER NOT NULL DEFAULT 0');

  addColumnIfNotExists('notes', 'is_pinned', 'INTEGER NOT NULL DEFAULT 0');

  addColumnIfNotExists('notes', 'is_favorite', 'INTEGER NOT NULL DEFAULT 0');

  addColumnIfNotExists('notes', 'category', "TEXT NOT NULL DEFAULT 'General'");
});

module.exports = db;
