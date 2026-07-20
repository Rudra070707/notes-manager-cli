const noteService = require("../services/noteService");

function execute(args) {
  noteService.addNote(args.join(" "));
}

module.exports = execute;
