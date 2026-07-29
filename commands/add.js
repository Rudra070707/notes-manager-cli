const { addNote } = require('../services/noteService');

function execute(args, options = {}) {
  let recurrence = null;

  if (options.daily) {
    recurrence = 'daily';
  } else if (options.weekly) {
    recurrence = 'weekly';
  } else if (options.monthly) {
    recurrence = 'monthly';
  }

  addNote(
    args[0],
    options.priority,
    options.tag,
    options.due,
    recurrence,
    options.category
  );
}

module.exports = execute;
