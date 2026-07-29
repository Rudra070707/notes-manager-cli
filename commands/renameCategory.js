const { renameCategory } = require('../services/noteService');

function execute(args) {
  renameCategory(args[0], args[1]);
}

module.exports = execute;
