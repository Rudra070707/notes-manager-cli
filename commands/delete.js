const noteService = require("../services/noteService");

function execute(args) {
  noteService.deleteNote(args[0]);
}

module.exports = execute;