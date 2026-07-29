const backupService = require('../services/backupService');

function restoreBackup(args) {
  backupService.restoreBackup(args[0]);
}

module.exports = restoreBackup;
