const { lockNote } = require('../services/noteService');

module.exports = function (args) {
  lockNote(args[0]);
};
