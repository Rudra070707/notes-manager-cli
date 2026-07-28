const { listTodayNotes } = require('../services/noteService');

function execute() {
  listTodayNotes();
}

module.exports = execute;
