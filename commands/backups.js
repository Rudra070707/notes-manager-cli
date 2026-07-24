const backupService = require('../services/backupService');

module.exports = function backups() {
  backupService.listBackups();
};
