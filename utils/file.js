const fs = require("fs");
const path = require("path");

// Use the default notes file unless a test file is provided
const NOTES_FILE = process.env.NOTES_FILE || path.join(__dirname, "..", "data", "notes.json");

function loadNotes() {
  try {
    const data = fs.readFileSync(NOTES_FILE, "utf8");

    if (!data.trim()) {
      return [];
    }

    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));
}

module.exports = {
  loadNotes,
  saveNotes,
};
