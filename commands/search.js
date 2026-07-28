const noteService = require('../services/noteService');

function execute(keyword, options = {}) {
  noteService.searchNotes(
    Array.isArray(keyword) ? keyword.join(' ') : keyword || '',
    options
  );
}

module.exports = execute;
