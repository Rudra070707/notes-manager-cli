const { addNote } = require('../services/noteService');

module.exports = function (args, options = {}) {
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
};
