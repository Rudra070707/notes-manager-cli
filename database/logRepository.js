const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '..', 'logs');
const logFile = path.join(logsDir, 'notes.log');

function ensureLogFile() {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, '', 'utf8');
  }
}

function getLogs() {
  ensureLogFile();

  const content = fs.readFileSync(logFile, 'utf8').trim();

  if (!content) {
    return [];
  }

  return content.split('\n').filter(Boolean).reverse();
}

function clearLogs() {
  ensureLogFile();
  fs.writeFileSync(logFile, '', 'utf8');
}

function addLog(message) {
  ensureLogFile();

  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`, 'utf8');
}

module.exports = {
  getLogs,
  clearLogs,
  addLog,
};
