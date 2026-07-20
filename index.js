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

  case "delete":
    notes.deleteNote(note);
    break;

  case "update":
    notes.updateNote(args[1], args.slice(2).join(" "));
    break;

  case "search":
    notes.searchNotes(note);
    break;

  default:
    console.log("Usage:");
    console.log('node index.js add "Your Note"');
    console.log("node index.js list");
    console.log("node index.js delete <number>");
    console.log('node index.js update <number> "New Note"');
    console.log('node index.js search "keyword"');
}