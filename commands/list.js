const { listNotes } = require('../services/noteService');

module.exports = function (args, options = {}) {
  listNotes(options);
};
