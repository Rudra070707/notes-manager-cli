const backupService = require('../services/backupService');

module.exports = function backup() {
  backupService.createBackup();
};
