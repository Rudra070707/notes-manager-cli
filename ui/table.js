const Table = require('cli-table3');

function printNotes(notes) {
  const table = new Table({
    head: [
      'ID',
      'Status',
      'Priority',
      'Category',
      'Due Date',
      'Repeat',
      'Tags',
      'Note',
    ],
    colWidths: [6, 15, 12, 15, 15, 12, 20, 35],
    wordWrap: true,
  });

  notes.forEach((note) => {
    table.push([
      note.id,
      note.completed ? '✓ Done' : '○ Pending',
      (note.priority || 'medium').toUpperCase(),
      note.category || 'General',
      note.dueDate || '-',
      note.recurrence ? note.recurrence.toUpperCase() : '-',
      (note.tags || []).join(', '),
      note.is_pinned ? `📌 ${note.text}` : note.text,
    ]);
  });

  console.log(table.toString());
}

module.exports = {
  printNotes,
};
