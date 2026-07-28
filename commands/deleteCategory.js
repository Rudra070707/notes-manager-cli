const { deleteCategory } = require('../services/noteService');

module.exports = function (args) {
  deleteCategory(args[0]);
};
