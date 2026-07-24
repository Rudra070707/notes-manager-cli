const { archiveNote } = require('../services/noteService');

module.exports = function (args) {
  archiveNote(args[0]);
};
