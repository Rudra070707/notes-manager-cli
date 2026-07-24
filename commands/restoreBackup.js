const backupService = require('../services/backupService');

module.exports = function restoreBackup(args) {
  backupService.restoreBackup(args[0]);
};
