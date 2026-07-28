const { showHistory, clearHistory } = require('../services/historyService');

module.exports = (options = {}) => {
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
};
