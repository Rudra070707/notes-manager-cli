const db = require('./database');

function formatNote(note) {
  return {
    ...note,
    completed: Boolean(note.completed),
    archived: Boolean(note.archived),
    is_trashed: Boolean(note.is_trashed),
    is_locked: Boolean(note.is_locked),
    is_pinned: Boolean(note.is_pinned),
    tags: note.tags ? JSON.parse(note.tags) : [],
    category: note.category || 'General',
  };
}

function getAllNotes(callback) {
  db.all(
    `
    SELECT *
    FROM notes
    WHERE archived = 0
      AND is_trashed = 0
    ORDER BY
      is_pinned DESC,
      priority DESC,
      id ASC
    `,
    [],
    (err, rows) => {
      if (err) return callback(err);

      callback(null, rows.map(formatNote));
    }
  );
}

function getArchivedNotes(callback) {
  db.all(
    `
    SELECT *
    FROM notes
    WHERE archived = 1
      AND is_trashed = 0
    ORDER BY
      is_pinned DESC,
      priority DESC,
      id ASC
    `,
    [],
    (err, rows) => {
      if (err) return callback(err);

      callback(null, rows.map(formatNote));
    }
  );
}

function getTrashedNotes(callback) {
  db.all(
    `
    SELECT *
    FROM notes
    WHERE is_trashed = 1
    ORDER BY
      is_pinned DESC,
      priority DESC,
      id ASC
    `,
    [],
    (err, rows) => {
      if (err) return callback(err);

      callback(null, rows.map(formatNote));
    }
  );
}

function getNoteById(id, callback) {
  db.get('SELECT * FROM notes WHERE id = ?', [id], (err, row) => {
    if (err) return callback(err);

    callback(null, row ? formatNote(row) : null);
  });
}

function addNote(note, callback) {
  db.run(
    `
    INSERT INTO notes
    (
      id,
      text,
      priority,
      tags,
      dueDate,
      recurrence,
      completed,
      archived,
      is_trashed,
is_locked,
is_pinned,
category,
createdAt
    )
    VALUES (
  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
)
    `,
    [
      note.id,
      note.text,
      note.priority,
      JSON.stringify(note.tags),
      note.dueDate,
      note.recurrence,
      note.completed ? 1 : 0,
      note.archived ? 1 : 0,
      note.is_trashed ? 1 : 0,
      note.is_locked ? 1 : 0,
      note.is_pinned ? 1 : 0,
      note.category || 'General',
      note.createdAt,
    ],
    callback
  );
}

function addNoteDirect(note, callback) {
  db.run(
    `
    INSERT INTO notes
    (
      id,
      text,
      priority,
      tags,
      dueDate,
      recurrence,
      completed,
      archived,
      is_trashed,
is_locked,
is_pinned,
category,
createdAt
    )
    VALUES (
  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
)
    `,
    [
      note.id,
      note.text,
      note.priority,
      JSON.stringify(note.tags),
      note.dueDate,
      note.recurrence,
      note.completed ? 1 : 0,
      note.archived ? 1 : 0,
      note.is_trashed ? 1 : 0,
      note.is_locked ? 1 : 0,
      note.is_pinned ? 1 : 0,
      note.category || 'General',
      note.createdAt,
    ],
    callback
  );
}

function updateNote(note, callback) {
  db.run(
    `
    UPDATE notes
    SET
      text = ?,
      priority = ?,
      tags = ?,
      dueDate = ?,
      recurrence = ?,
completed = ?,
category = ?
WHERE id = ?
    `,
    [
      note.text,
      note.priority,
      JSON.stringify(note.tags),
      note.dueDate,
      note.recurrence,
      note.completed ? 1 : 0,
      note.category || 'General',
      note.id,
    ],
    callback
  );
}
function setCategory(id, category, callback) {
  db.run(
    `
    UPDATE notes
    SET category = ?
    WHERE id = ?
    `,
    [category, id],
    callback
  );
}
function archiveNote(id, callback) {
  db.run('UPDATE notes SET archived = 1 WHERE id = ?', [id], callback);
}

function restoreArchivedNote(id, callback) {
  db.run('UPDATE notes SET archived = 0 WHERE id = ?', [id], callback);
}

function clearArchivedNotes(callback) {
  db.run('DELETE FROM notes WHERE archived = 1', [], callback);
}

function moveToTrash(id, callback) {
  db.run('UPDATE notes SET is_trashed = 1 WHERE id = ?', [id], callback);
}

function restoreFromTrash(id, callback) {
  db.run('UPDATE notes SET is_trashed = 0 WHERE id = ?', [id], callback);
}

function emptyTrash(callback) {
  db.run('DELETE FROM notes WHERE is_trashed = 1', [], callback);
}

function lockNote(id, callback) {
  db.run('UPDATE notes SET is_locked = 1 WHERE id = ?', [id], callback);
}

function unlockNote(id, callback) {
  db.run('UPDATE notes SET is_locked = 0 WHERE id = ?', [id], callback);
}

function pinNote(id, callback) {
  db.run('UPDATE notes SET is_pinned = 1 WHERE id = ?', [id], callback);
}

function unpinNote(id, callback) {
  db.run('UPDATE notes SET is_pinned = 0 WHERE id = ?', [id], callback);
}

function deleteNote(id, callback) {
  db.run('DELETE FROM notes WHERE id = ?', [id], callback);
}

function clearNotes(callback) {
  db.run('DELETE FROM notes', [], callback);
}

module.exports = {
  getAllNotes,
  getArchivedNotes,
  getTrashedNotes,
  getNoteById,
  addNote,
  addNoteDirect,
  updateNote,
  setCategory,
  archiveNote,
  restoreArchivedNote,
  clearArchivedNotes,
  moveToTrash,
  restoreFromTrash,
  emptyTrash,
  lockNote,
  unlockNote,
  pinNote,
  unpinNote,
  deleteNote,
  clearNotes,
};
