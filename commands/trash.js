const { listTrashedNotes } = require('../services/noteService');

function execute() {
  listTrashedNotes();
}

module.exports = execute;
