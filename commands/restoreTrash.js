const { restoreTrashedNote } = require('../services/noteService');

module.exports = (args) => {
  restoreTrashedNote(args[0]);
};
