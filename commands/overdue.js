const { listOverdueNotes } = require('../services/noteService');

function execute() {
  listOverdueNotes();
}

module.exports = execute;
