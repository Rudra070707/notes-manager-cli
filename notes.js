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

module.exports = {
  addNote,
  listNotes
};