const { exportNotes } = require('../services/exportService');

function handleExportCommand(format) {
  if (!format) {
    console.log('\nUsage:');
    console.log('notes export json');
    console.log('notes export csv');
    console.log('notes export md');
    return;
  }

  exportNotes(format);
}

module.exports = handleExportCommand;
