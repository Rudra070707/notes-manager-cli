const { deleteCategory } = require('../services/noteService');

function execute(args) {
  deleteCategory(args[0]);
}

module.exports = execute;
