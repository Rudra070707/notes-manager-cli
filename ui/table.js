const Table = require('cli-table3');

function getRelativeDueDate(dueDate) {
  if (!dueDate) {
    return '-';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

  switch (diffDays) {
    case 0:
      return 'Today';

    case 1:
      return 'Tomorrow';

    case -1:
      return 'Yesterday';

    default:
      if (diffDays > 1 && diffDays <= 30) {
        return `${diffDays} day(s) left`;
      }

      if (diffDays < -1) {
        return `${Math.abs(diffDays)} day(s) overdue`;
      }

      return dueDate;
  }
}

function truncate(text, maxLength) {
  if (!text) {
    return '';
  }

  return text.length > maxLength
    ? `${text.substring(0, maxLength - 3)}...`
    : text;
}

function printNotes(notes) {
  const table = new Table({
    head: [
      'ID',
      '★',
      'Status',
      'Priority',
      'Category',
      'Due',
      'Repeat',
      'Tags',
      'Note',
    ],
    colWidths: [5, 3, 12, 10, 15, 18, 10, 18, 40],
    wordWrap: true,
    style: {
      head: ['cyan'],
      border: ['grey'],
    },
  });

  notes.forEach((note) => {
    const due = getRelativeDueDate(note.dueDate);

    const status = note.completed ? '✓ Done' : '○ Pending';

    const priority = (note.priority || 'medium').toUpperCase();

    const category = note.category || 'General';

    const recurrence = note.recurrence ? note.recurrence.toUpperCase() : '-';

    const tags =
      Array.isArray(note.tags) && note.tags.length ? note.tags.join(', ') : '-';

    const favorite = note.is_favorite ? '★' : '';

    const noteText = note.is_pinned
      ? `📌 ${truncate(note.text || '', 35)}`
      : truncate(note.text || '', 37);

    table.push([
      note.id,
      favorite,
      status,
      priority,
      category,
      due,
      recurrence,
      tags,
      noteText,
    ]);
  });

  console.log(table.toString());
}

module.exports = {
  printNotes,
};
