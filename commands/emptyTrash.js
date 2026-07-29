const { emptyTrashBin } = require('../services/noteService');

function execute() {
  emptyTrashBin();
}

module.exports = execute;
