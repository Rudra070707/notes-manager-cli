const noteService = require("../services/noteService");

function execute() {
  noteService.showStats();
}

module.exports = execute;