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
      is_trashed INTEGER NOT NULL DEFAULT 0,
is_locked INTEGER NOT NULL DEFAULT 0,
is_pinned INTEGER NOT NULL DEFAULT 0,
category TEXT NOT NULL DEFAULT 'General',
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
  // Database Migrations
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

    const hasTrashed = columns.some((column) => column.name === 'is_trashed');

    if (!hasTrashed) {
      db.run(
        'ALTER TABLE notes ADD COLUMN is_trashed INTEGER NOT NULL DEFAULT 0',
        (alterErr) => {
          if (alterErr) {
            console.error(alterErr.message);
          } else {
            console.log('✔ Database migrated: is_trashed column added.');
          }
        }
      );
    }

    const hasLocked = columns.some((column) => column.name === 'is_locked');

    if (!hasLocked) {
      db.run(
        'ALTER TABLE notes ADD COLUMN is_locked INTEGER NOT NULL DEFAULT 0',
        (alterErr) => {
          if (alterErr) {
            console.error(alterErr.message);
          } else {
            console.log('✔ Database migrated: is_locked column added.');
          }
        }
      );
    }

    const hasPinned = columns.some((column) => column.name === 'is_pinned');

    if (!hasPinned) {
      db.run(
        'ALTER TABLE notes ADD COLUMN is_pinned INTEGER NOT NULL DEFAULT 0',
        (alterErr) => {
          if (alterErr) {
            console.error(alterErr.message);
          } else {
            console.log('✔ Database migrated: is_pinned column added.');
          }
        }
      );
    }
    const hasCategory = columns.some((column) => column.name === 'category');

    if (!hasCategory) {
      db.run(
        "ALTER TABLE notes ADD COLUMN category TEXT NOT NULL DEFAULT 'General'",
        (alterErr) => {
          if (alterErr) {
            console.error(alterErr.message);
          } else {
            console.log('✔ Database migrated: category column added.');
          }
        }
      );
    }
  });
});

module.exports = db;
