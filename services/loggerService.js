const fs = require('fs');
const path = require('path');

const logsDirectory = path.join(__dirname, '..', 'logs');
const logFile = path.join(logsDirectory, 'notes.log');

function ensureLogDirectory() {
  if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory, { recursive: true });
  }

  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, '', 'utf8');
  }
}

function getTimestamp() {
  return new Date().toISOString().replace('T', ' ').split('.')[0];
}

function log(action, message) {
  ensureLogDirectory();

  const logEntry = `[${getTimestamp()}] ${action.toUpperCase()} | ${message}\n`;

  try {
    fs.appendFileSync(logFile, logEntry, 'utf8');
  } catch (err) {
    console.error('Failed to write log:', err.message);
  }
}

module.exports = {
  log,
};
