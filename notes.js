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
  const notes = loadNotes();

  notes.push(note);

  saveNotes(notes);

  console.log("✅ Note added successfully!");
}

function listNotes() {
  const notes = loadNotes();

  console.log("\n📒 Notes:");

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
module.exports = {
  addNote,
  listNotes,
  deleteNote
};