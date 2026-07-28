const { generateReport } = require('../services/noteService');

function execute() {
  generateReport();
}

module.exports = execute;
