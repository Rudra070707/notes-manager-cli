const { Command } = require('commander');
const { setCategory } = require('../services/noteService');

const categoryCommand = new Command('category');

categoryCommand
  .description('Change the category of a note')
  .argument('<id>', 'Note ID')
  .argument('<category>', 'Category name')
  .action((id, category) => {
    setCategory(id, category);
  });

module.exports = categoryCommand;
