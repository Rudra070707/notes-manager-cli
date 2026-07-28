const { getLogs, clearLogs } = require('../database/logRepository');
const ui = require('../ui/colors');

function showHistory(options = {}) {
  let logs = getLogs();

  ui.heading('\nHistory');
  ui.divider();

  if (!logs || logs.length === 0) {
    ui.warning('No history available.');
    return;
  }

  /* -------------------------
     Show today's history
  ------------------------- */
  if (options.today) {
    const today = new Date().toISOString().slice(0, 10);

    logs = logs.filter((log) => log.includes(today));
  }

  /* -------------------------
     Filter by action type
  ------------------------- */
  if (options.type) {
    const type = options.type.trim().toUpperCase();

    logs = logs.filter((log) => log.toUpperCase().includes(type));
  }

  /* -------------------------
     Search history
  ------------------------- */
  if (options.search) {
    const keyword = options.search.trim().toLowerCase();

    logs = logs.filter((log) => log.toLowerCase().includes(keyword));
  }

  /* -------------------------
     Limit results
  ------------------------- */
  if (options.limit !== undefined) {
    const limit = Number(options.limit);

    if (Number.isNaN(limit) || limit <= 0) {
      ui.error('✖ Limit must be a positive number.');
      return;
    }

    logs = logs.slice(0, limit);
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
    ui.error('✖ Failed to clear history.');
  }
}

module.exports = {
  showHistory,
  clearHistory,
};
