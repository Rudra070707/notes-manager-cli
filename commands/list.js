const noteService = require("../services/noteService");

function execute() {
  noteService.listNotes();
}

module.exports = execute;
