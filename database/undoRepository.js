const db = require('./database');

function saveUndo(operation, payload, callback) {
  db.run(
    `
    INSERT INTO undo_history (operation, payload, createdAt)
    VALUES (?, ?, ?)
    `,
    [operation, JSON.stringify(payload), new Date().toISOString()],
    callback
  );
}

function getLastUndo(callback) {
  db.get(
    `
    SELECT *
    FROM undo_history
    ORDER BY id DESC
    LIMIT 1
    `,
    (err, row) => {
      if (err) {
        callback(err);
        return;
      }

      if (!row) {
        callback(null, null);
        return;
      }

      let payload;

      try {
        payload = JSON.parse(row.payload);
      } catch {
        callback(new Error('Invalid undo payload.'));
        return;
      }

      callback(null, {
        ...row,
        payload,
      });
    }
  );
}

function deleteLastUndo(callback) {
  db.run(
    `
    DELETE FROM undo_history
    WHERE id = (
      SELECT id
      FROM undo_history
      ORDER BY id DESC
      LIMIT 1
    )
    `,
    callback
  );
}

module.exports = {
  saveUndo,
  getLastUndo,
  deleteLastUndo,
};
