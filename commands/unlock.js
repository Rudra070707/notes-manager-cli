const { unlockNote } = require('../services/noteService');

module.exports = function (args) {
  unlockNote(args[0]);
};
