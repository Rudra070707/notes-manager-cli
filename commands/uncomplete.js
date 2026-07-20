const noteService = require("../services/noteService");

function execute(args) {
  noteService.uncompleteNote(args[0]);
}

module.exports = execute;