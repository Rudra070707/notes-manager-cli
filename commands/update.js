const noteService = require('../services/noteService');

function execute(args) {
  const [id, ...textParts] = args;

  if (!id || textParts.length === 0) {
    console.error('Usage: notes update <id> <new text>');
    return;
  }

  noteService.updateNote(id, textParts.join(' '));
}

module.exports = execute;
