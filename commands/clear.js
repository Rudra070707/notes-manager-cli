const noteService = require("../services/noteService");

function execute() {
  noteService.clearNotes();
}

module.exports = execute;