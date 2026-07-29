const { clearNotes } = require('../services/noteService');

async function execute() {
  const { default: inquirer } = await import('inquirer');

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure you want to delete ALL notes?',
      default: false,
    },
  ]);

  if (!confirm) {
    console.log('Operation cancelled.');
    return;
  }

  clearNotes();
}

module.exports = execute;
