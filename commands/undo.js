const { undoLastOperation } = require('../services/undoService');

module.exports = function () {
  undoLastOperation();
};
