const db = require('./database');

/*
====================================
Security Repository
====================================
Stores a single hashed master secret.

Only ONE row exists.

id = 1
*/

function initializeSecurityTable() {
  db.run(`
    CREATE TABLE IF NOT EXISTS security (
      id INTEGER PRIMARY KEY CHECK(id = 1),
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
}

initializeSecurityTable();

/*
====================================
Save Secret
====================================
*/

function saveSecret(hash, callback) {
  db.run(
    `
      INSERT OR REPLACE INTO security
      (id, password_hash, created_at)
      VALUES
      (1, ?, datetime('now'))
    `,
    [hash],
    callback
  );
}

/*
====================================
Get Secret
====================================
*/

function getSecret(callback) {
  db.get(
    `
      SELECT *
      FROM security
      WHERE id = 1
    `,
    callback
  );
}

/*
====================================
Delete Secret
====================================
*/

function deleteSecret(callback) {
  db.run(
    `
      DELETE
      FROM security
      WHERE id = 1
    `,
    callback
  );
}

module.exports = {
  saveSecret,
  getSecret,
  deleteSecret,
};
