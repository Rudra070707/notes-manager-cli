const fs = require('fs');
const path = require('path');

const logsDirectory = path.join(__dirname, '..', 'logs');
const logFile = path.join(logsDirectory, 'app.log');

function ensureLogDirectory() {
  if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory, { recursive: true });
  }
}

function getTimestamp() {
  return new Date().toISOString().replace('T', ' ').split('.')[0];
}

function log(action, message) {
  ensureLogDirectory();

  const logEntry =
    `[${getTimestamp()}] ` + `${action.toUpperCase()} ` + `- ${message}\n`;

  fs.appendFile(logFile, logEntry, (err) => {
    if (err) {
      console.error('Failed to write log:', err.message);
    }
  });
}

module.exports = {
  log,
};
