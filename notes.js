const fs = require("fs");

function loadNotes() {
  const data = fs.readFileSync("./notes/notes.json", "utf8");
  return JSON.parse(data);
}

function saveNotes(notes) {
  fs.writeFileSync(
    "./notes/notes.json",
    JSON.stringify(notes, null, 2)
  );
}

function addNote(note) {
    if (!note) {
  console.log("❌ Please provide a note.");
  console.log('Example: node index.js add "Learn Express"');
  return;
}
  const notes = loadNotes();

const exists = notes.some(
  existingNote =>
    existingNote.toLowerCase() === note.toLowerCase()
);

if (exists) {
  console.log("❌ Note already exists.");
  return;
}

notes.push(note);

saveNotes(notes);

console.log("✅ Note added successfully!");
}

function listNotes() {
  const notes = loadNotes();

  console.log("\n📒 Notes:");

  if (notes.length === 0) {
    console.log("No notes found.");
    return;
  }

  notes.forEach((note, index) => {
    console.log(`${index + 1}. ${note}`);
  });
}
function deleteNote(index) {
  const notes = loadNotes();

  const noteIndex = Number(index) - 1;

  if (isNaN(noteIndex) || noteIndex < 0 || noteIndex >= notes.length) {
    console.log("❌ Invalid note number.");
    return;
  }

  const deletedNote = notes[noteIndex];

  notes.splice(noteIndex, 1);

  saveNotes(notes);

  console.log(`🗑️ Deleted: ${deletedNote}`);
}
function updateNote(index, newNote) {
  if (!newNote) {
    console.log("❌ Please provide the updated note.");
    console.log('Example: node index.js update 2 "Learn PostgreSQL"');
    return;
  }

  const notes = loadNotes();

  const noteIndex = Number(index) - 1;

  if (isNaN(noteIndex) || noteIndex < 0 || noteIndex >= notes.length) {
    console.log("❌ Invalid note number.");
    return;
  }

  const exists = notes.some(
    (note, i) =>
      i !== noteIndex &&
      note.toLowerCase() === newNote.toLowerCase()
  );

  if (exists) {
    console.log("❌ Note already exists.");
    return;
  }

  const oldNote = notes[noteIndex];

  notes[noteIndex] = newNote;

  saveNotes(notes);

  console.log(`✏️ Updated:\n"${oldNote}"\n➡️ "${newNote}"`);
}
function clearNotes() {
  saveNotes([]);

  console.log("🗑️ All notes have been deleted.");
}
function searchNotes(keyword) {
  if (!keyword) {
    console.log("❌ Please provide a search keyword.");
    console.log('Example: node index.js search "Express"');
    return;
  }

  const notes = loadNotes();

  const results = notes.filter(note =>
    note.toLowerCase().includes(keyword.toLowerCase())
  );

  console.log("\n🔍 Search Results\n");

  if (results.length === 0) {
    console.log("No matching notes found.");
    return;
  }

  results.forEach((note, index) => {
    console.log(`${index + 1}. ${note}`);
  });
}
module.exports = {
  addNote,
  listNotes,
  deleteNote,
  updateNote,
  searchNotes,
  clearNotes
};