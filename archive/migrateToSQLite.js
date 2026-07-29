const fs = require('fs');
const path = require('path');

const { run, get } = require('../utils/db');

const jsonPath = path.join(__dirname, '../data/notes.json');

async function migrate() {
  if (!fs.existsSync(jsonPath)) {
    console.log('✖ notes.json not found.');
    return;
  }

  let notes;

  try {
    notes = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    if (!Array.isArray(notes)) {
      throw new TypeError('notes.json must contain an array.');
    }
  } catch (error) {
    console.error('✖ Failed to read notes.json.');
    console.error(error.message);
    return;
  }

  let imported = 0;
  let skipped = 0;

  for (const note of notes) {
    const existing = await get(
      'SELECT id FROM notes WHERE id = ?',
      [note.id]
    );

    if (existing) {
      skipped++;
      continue;
    }

    await run(
      `
      INSERT INTO notes
      (
        id,
        text,
        priority,
        tags,
        dueDate,
        recurrence,
        completed,
        createdAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        note.id,
        note.text,
        note.priority || 'medium',
        JSON.stringify(note.tags || []),
        note.dueDate || null,
        note.recurrence || null,
        note.completed ? 1 : 0,
        note.createdAt,
      ]
    );

    imported++;
  }

  console.log(`✔ Imported ${imported} notes.`);
  console.log(`✔ Skipped ${skipped} existing notes.`);
}

migrate().catch((error) => {
  console.error('✖ Migration failed.');
  console.error(error);
});
