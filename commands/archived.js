const { listArchivedNotes } = require('../services/noteService');

function execute() {
  listArchivedNotes();
}

module.exports = execute;
