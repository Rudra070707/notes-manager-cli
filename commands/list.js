const { listNotes } = require('../services/noteService');

function execute(args, options = {}) {
  listNotes(options);
}

module.exports = execute;
