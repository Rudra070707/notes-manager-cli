const { loadNotes, saveNotes } = require("../utils/file");

function addNote(text) {
  if (!text) {
    console.log("❌ Please provide a note.");
    console.log("Example: node index.js add \"Learn Express\"");
    return;
  }

  const notes = loadNotes();

  const exists = notes.some(
    note => note.text.toLowerCase() === text.toLowerCase()
  );

  if (exists) {
    console.log("❌ Note already exists.");
    return;
  }

  const nextId =
    notes.length === 0
      ? 1
      : Math.max(...notes.map(note => note.id)) + 1;

  const newNote = {
    id: nextId,
    text,
    completed: false,
    createdAt: new Date().toISOString()
  };

  notes.push(newNote);

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

  notes.forEach(note => {
    const status = note.completed ? "✅" : "⬜";
    console.log(`${status} [${note.id}] ${note.text}`);
  });
}

function deleteNote(id) {
  const notes = loadNotes();

  const index = notes.findIndex(note => note.id === Number(id));

  if (index === -1) {
    console.log("❌ Invalid note ID.");
    return;
  }

  const deleted = notes[index];

  notes.splice(index, 1);

  saveNotes(notes);

  console.log(`🗑️ Deleted: ${deleted.text}`);
}

function updateNote(id, newText) {
  if (!newText) {
    console.log("❌ Please provide the updated note.");
    return;
  }

  const notes = loadNotes();

  const note = notes.find(note => note.id === Number(id));

  if (!note) {
    console.log("❌ Invalid note ID.");
    return;
  }

  const exists = notes.some(
    n =>
      n.id !== note.id &&
      n.text.toLowerCase() === newText.toLowerCase()
  );

  if (exists) {
    console.log("❌ Note already exists.");
    return;
  }

  const oldText = note.text;

  note.text = newText;

  saveNotes(notes);

  console.log(`✏️ Updated:\n"${oldText}"\n➡️ "${newText}"`);
}

function completeNote(id) {
  const notes = loadNotes();

  const note = notes.find(note => note.id === Number(id));

  if (!note) {
    console.log("❌ Invalid note ID.");
    return;
  }

  note.completed = true;

  saveNotes(notes);

  console.log(`✅ Completed: ${note.text}`);
}

function uncompleteNote(id) {
  const notes = loadNotes();

  const note = notes.find(note => note.id === Number(id));

  if (!note) {
    console.log("❌ Invalid note ID.");
    return;
  }

  note.completed = false;

  saveNotes(notes);

  console.log(`⬜ Marked as pending: ${note.text}`);
}

function clearNotes() {
  saveNotes([]);
  console.log("🗑️ All notes have been deleted.");
}

function searchNotes(keyword) {
  if (!keyword) {
    console.log("❌ Please provide a keyword.");
    return;
  }

  const notes = loadNotes();

  const results = notes.filter(note =>
    note.text.toLowerCase().includes(keyword.toLowerCase())
  );

  console.log("\n🔍 Search Results\n");

  if (results.length === 0) {
    console.log("No matching notes found.");
    return;
  }

  results.forEach(note => {
    const status = note.completed ? "✅" : "⬜";
    console.log(`${status} [${note.id}] ${note.text}`);
  });
}

function showStats() {
  const notes = loadNotes();

  const total = notes.length;
  const completed = notes.filter(note => note.completed).length;
  const pending = total - completed;

  const completionRate =
    total === 0 ? 0 : ((completed / total) * 100).toFixed(2);

  console.log("\n📊 Notes Statistics");
  console.log("-------------------");
  console.log(`Total Notes      : ${total}`);
  console.log(`Completed Notes  : ${completed}`);
  console.log(`Pending Notes    : ${pending}`);
  console.log(`Completion Rate  : ${completionRate}%`);
}

module.exports = {
  addNote,
  listNotes,
  deleteNote,
  updateNote,
  completeNote,
  uncompleteNote,
  clearNotes,
  searchNotes,
  showStats
};
