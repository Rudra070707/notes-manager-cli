const notes = require("./notes");

const args = process.argv.slice(2);

const command = args[0];
const note = args[1];

switch (command) {
  case "add":
    notes.addNote(note);
    break;

  case "list":
    notes.listNotes();
    break;

  default:
    console.log("Usage:");
    console.log('node index.js add "Your Note"');
    console.log("node index.js list");
}