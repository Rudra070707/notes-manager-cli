const { listCategories } = require('../services/noteService');

function execute() {
  listCategories();
}

module.exports = execute;
