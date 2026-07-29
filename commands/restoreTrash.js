const { restoreTrashedNote } = require('../services/noteService');

function execute(args) {
  restoreTrashedNote(args[0]);
}

module.exports = execute;
