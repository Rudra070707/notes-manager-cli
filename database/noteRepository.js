const db = require("./database");

function formatNote(note) {
  return {
    ...note,
    completed: Boolean(note.completed),
    tags: note.tags ? JSON.parse(note.tags) : [],
  };
}

function getAllNotes(callback) {
  db.all("SELECT * FROM notes ORDER BY id ASC", [], (err, rows) => {
    if (err) return callback(err);

    callback(null, rows.map(formatNote));
  });
}

function getNoteById(id, callback) {
  db.get("SELECT * FROM notes WHERE id = ?", [id], (err, row) => {
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
      createdAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      note.id,
      note.text,
      note.priority,
      JSON.stringify(note.tags),
      note.dueDate,
      note.recurrence,
      note.completed ? 1 : 0,
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
      text=?,
      priority=?,
      tags=?,
      dueDate=?,
      recurrence=?,
      completed=?
    WHERE id=?
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

function deleteNote(id, callback) {
  db.run("DELETE FROM notes WHERE id=?", [id], callback);
}

function clearNotes(callback) {
  db.run("DELETE FROM notes", [], callback);
}

module.exports = {
  getAllNotes,
  getNoteById,
  addNote,
  updateNote,
  deleteNote,
  clearNotes,
};
