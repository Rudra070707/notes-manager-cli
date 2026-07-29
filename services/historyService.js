const { getLogs, clearLogs } = require('../database/logRepository');
const ui = require('../ui/colors');

function showHistory(options = {}) {
  const { today = false, type, search, limit } = options;

  let logs = getLogs();

  ui.heading('\nHistory');
  ui.divider();

  if (!Array.isArray(logs) || logs.length === 0) {
    ui.warning('No history available.');
    return;
  }

  if (today) {
    const todayDate = new Date().toISOString().slice(0, 10);

    logs = logs.filter((log) => log.includes(todayDate));
  }

  if (type) {
    const filterType = String(type).trim().toUpperCase();

    logs = logs.filter((log) => {
      const upperLog = log.toUpperCase();

      return upperLog.includes(filterType);
    });
  }

  if (search) {
    const keyword = String(search).trim().toLowerCase();

    logs = logs.filter((log) => {
      const lowerLog = log.toLowerCase();

      return lowerLog.includes(keyword);
    });
  }

  if (limit !== undefined) {
    const parsedLimit = Number(limit);

    if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
      ui.error('✖ Limit must be a positive integer.');
      return;
    }

    logs = logs.slice(0, parsedLimit);
  }

  if (logs.length === 0) {
    ui.warning('No matching history found.');
    return;
  }

  logs.forEach((log) => {
    console.log(log);
  });
}

function clearHistory() {
  try {
    clearLogs();
    ui.success('✔ History cleared successfully.');
  } catch (error) {
    ui.error(`✖ Failed to clear history. ${error.message}`);
  }
}

module.exports = {
  showHistory,
  clearHistory,
};
