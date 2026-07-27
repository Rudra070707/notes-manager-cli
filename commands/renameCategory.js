const { renameCategory } = require('../services/noteService');

module.exports = function (args) {
  renameCategory(args[0], args[1]);
};
