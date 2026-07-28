const fs = require('fs');
const path = require('path');

const repository = require('../database/noteRepository');
const {
  parseJson,
  parseCsv,
  parseMarkdown,
} = require('../utils/importParsers');

function importNotes(notes) {
  let imported = 0;
  let skipped = 0;

  function importNext(index) {
    if (index >= notes.length) {
      console.log(`\n✔ Imported ${imported} notes`);
      console.log(`✔ Skipped ${skipped} duplicate notes`);
      return;
    }

    const note = notes[index];

    repository.getNoteById(note.id, (err, existingNote) => {
      if (err) {
        console.error(err.message);
        return;
      }

      if (existingNote) {
        skipped++;
        return importNext(index + 1);
      }

      repository.addNote(note, (err) => {
        if (err) {
          console.error(err.message);
        } else {
          imported++;
        }

        importNext(index + 1);
      });
    });
  }

  importNext(0);
}

function importJson(filePath) {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    console.log('File not found.');
    return;
  }

  let notes;

  try {
    notes = parseJson(fs.readFileSync(absolutePath, 'utf8'));
  } catch (error) {
    console.log(error.message);
    return;
  }

  importNotes(notes);
}

function importCsv(filePath) {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    console.log('File not found.');
    return;
  }

  let notes;

  try {
    notes = parseCsv(fs.readFileSync(absolutePath, 'utf8'));
  } catch (error) {
    console.log(error.message);
    return;
  }

  importNotes(notes);
}

function importMarkdown(filePath) {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    console.log('File not found.');
    return;
  }

  let notes;

  try {
    notes = parseMarkdown(fs.readFileSync(absolutePath, 'utf8'));
  } catch (error) {
    console.log(error.message);
    return;
  }

  importNotes(notes);
}

module.exports = {
  importJson,
  importCsv,
  importMarkdown,
};
