const fs = require('fs');
const path = require('path');

const ui = require('../ui/colors');
const logger = require('./loggerService');

const databasePath = path.join(__dirname, '..', 'data', 'notes.db');
const backupDirectory = path.join(__dirname, '..', 'backups');

function ensureBackupDirectory() {
  if (!fs.existsSync(backupDirectory)) {
    fs.mkdirSync(backupDirectory, { recursive: true });
  }
}

function getTimestamp() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}-${hour}-${minute}-${second}`;
}

function createBackup() {
  ensureBackupDirectory();

  if (!fs.existsSync(databasePath)) {
    ui.error('✖ Database file not found.');
    return;
  }

  const backupName = `notes-${getTimestamp()}.db`;
  const backupPath = path.join(backupDirectory, backupName);

  fs.copyFile(databasePath, backupPath, (err) => {
    if (err) {
      ui.error('✖ Failed to create backup.');
      return;
    }

    logger.log('BACKUP', backupName);

    ui.success('✔ Backup created successfully.');
    console.log(backupName);
  });
}

function listBackups() {
  ensureBackupDirectory();

  const backups = fs
    .readdirSync(backupDirectory)
    .filter(
      (file) =>
        file.endsWith('.db') &&
        fs.statSync(path.join(backupDirectory, file)).isFile()
    )
    .sort()
    .reverse();

  ui.heading('\nAvailable Backups');
  ui.divider();

  if (backups.length === 0) {
    ui.warning('No backups found.');
    return;
  }

  backups.forEach((backup, index) => {
    console.log(`${index + 1}. ${backup}`);
  });
}

function restoreBackup(backupName) {
  ensureBackupDirectory();

  if (!backupName) {
    ui.error('✖ Please provide a backup filename.');
    return;
  }

  const backupPath = path.join(backupDirectory, backupName);

  if (!fs.existsSync(backupPath)) {
    ui.error('✖ Backup file not found.');
    return;
  }

  fs.copyFile(backupPath, databasePath, (err) => {
    if (err) {
      ui.error('✖ Failed to restore backup.');
      return;
    }

    logger.log('RESTORE_BACKUP', backupName);

    ui.success('✔ Database restored successfully.');
  });
}

module.exports = Object.freeze({
  databasePath,
  backupDirectory,
  ensureBackupDirectory,
  getTimestamp,
  createBackup,
  listBackups,
  restoreBackup,
});
