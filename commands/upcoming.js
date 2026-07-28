const { listUpcomingNotes } = require('../services/noteService');

function execute() {
  listUpcomingNotes();
}

module.exports = execute;
