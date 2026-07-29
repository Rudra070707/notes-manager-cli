const { listFavoriteNotes } = require('../services/noteService');

function execute() {
  listFavoriteNotes();
}

module.exports = execute;
