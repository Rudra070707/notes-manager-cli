const { showHistory, clearHistory } = require('../services/historyService');

function execute(options = {}) {
  if (options.clear) {
    clearHistory();
    return;
  }

  showHistory({
    limit: options.limit,
    type: options.type,
    search: options.search,
    today: options.today,
  });
}

module.exports = execute;
