const { addNote } = require("../services/noteService");

module.exports = function (args, options = {}) {
  addNote(args[0], options.priority, options.tag);
};
