const { unlockNote } = require('../services/noteService');

function execute(ids) {
  if (!Array.isArray(ids) || ids.length === 0) {
    console.log('Please provide at least one note ID.');
    return;
  }

  for (const id of ids) {
    unlockNote(id);
  }
}

module.exports = execute;
