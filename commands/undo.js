const { undoLastOperation } = require('../services/undoService');

function execute() {
  undoLastOperation();
}

module.exports = execute;
