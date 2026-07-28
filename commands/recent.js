const { listRecentNotes } = require('../services/noteService');

function execute() {
  listRecentNotes();
}

module.exports = execute;
