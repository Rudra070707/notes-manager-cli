const db = require('./database');

function formatNote(note) {
  return {
    ...note,
    completed: Boolean(note.completed),
    archived: Boolean(note.archived),
    tags: note.tags ? JSON.parse(note.tags) : [],
  };
}

function getAllNotes(callback) {
  db.all(
    'SELECT * FROM notes WHERE archived = 0 ORDER BY id ASC',
    [],
    (err, rows) => {
      if (err) return callback(err);

      callback(null, rows.map(formatNote));
    }
  );
}

function getArchivedNotes(callback) {
  db.all(
    'SELECT * FROM notes WHERE archived = 1 ORDER BY id ASC',
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
      createdAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      createdAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      completed = ?
    WHERE id = ?
    `,
    [
      note.text,
      note.priority,
      JSON.stringify(note.tags),
      note.dueDate,
      note.recurrence,
      note.completed ? 1 : 0,
      note.id,
    ],
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

function deleteNote(id, callback) {
  db.run('DELETE FROM notes WHERE id = ?', [id], callback);
}

function clearNotes(callback) {
  db.run('DELETE FROM notes', [], callback);
}

module.exports = {
  getAllNotes,
  getArchivedNotes,
  getNoteById,
  addNote,
  addNoteDirect,
  updateNote,
  archiveNote,
  restoreArchivedNote,
  clearArchivedNotes,
  deleteNote,
  clearNotes,
};
