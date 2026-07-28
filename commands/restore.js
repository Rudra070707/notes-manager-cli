const { restoreArchivedNote } = require('../services/noteService');

function execute(ids) {
  if (!Array.isArray(ids) || ids.length === 0) {
    console.log('Please provide at least one note ID.');
    return;
  }

  ids.forEach((id) => {
    restoreArchivedNote(id);
  });
}

module.exports = execute;
