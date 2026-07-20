const noteService = require("../services/noteService");

function execute(args) {
  noteService.searchNotes(args.join(" "));
}

module.exports = execute;