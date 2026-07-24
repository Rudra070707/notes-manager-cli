const { restoreArchivedNote } = require('../services/noteService');

module.exports = function (args) {
  restoreArchivedNote(args[0]);
};
