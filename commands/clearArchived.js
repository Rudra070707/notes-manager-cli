const { clearArchivedNotes } = require('../services/noteService');

module.exports = async function () {
  const { default: inquirer } = await import('inquirer');

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message:
        'Are you sure you want to permanently delete ALL archived notes?',
      default: false,
    },
  ]);

  if (!confirm) {
    console.log('Operation cancelled.');
    return;
  }

  clearArchivedNotes();
};
