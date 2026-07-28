const noteService = require('../services/noteService');

function execute(args) {
  noteService.updateNote(args[0], args.slice(1).join(' '));
}

module.exports = execute;
