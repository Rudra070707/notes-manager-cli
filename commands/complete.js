const noteService = require("../services/noteService");

function execute(args) {
  noteService.completeNote(args[0]);
}

module.exports = execute;