const { showNextTask } = require('../services/noteService');

function execute() {
  showNextTask();
}

module.exports = execute;
