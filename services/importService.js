const fs = require('node:fs');
const path = require('node:path');

const repository = require('../database/noteRepository');
const {
  parseJson,
  parseCsv,
  parseMarkdown,
} = require('../utils/importParsers');

function importNotes(notes) {
  let imported = 0;
  let skipped = 0;

  function finish() {
    console.log(`\n✔ Imported ${imported} notes`);
    console.log(`✔ Skipped ${skipped} duplicate notes`);
  }

  function importNext(index) {
    if (index >= notes.length) {
      finish();
      return;
    }

    const note = notes[index];

    repository.getNoteById(note.id, (lookupError, existingNote) => {
      if (lookupError) {
        console.error(lookupError.message);
        return;
      }

      if (existingNote) {
        skipped++;
        importNext(index + 1);
        return;
      }

      repository.addNote(note, (insertError) => {
        if (insertError) {
          console.error(insertError.message);
        } else {
          imported++;
        }

        importNext(index + 1);
      });
    });
  }

  importNext(0);
}

function readNotes(filePath, parser) {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    console.log('File not found.');
    return null;
  }

  try {
    const fileContent = fs.readFileSync(absolutePath, 'utf8');

    return parser(fileContent);
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

function importJson(filePath) {
  const notes = readNotes(filePath, parseJson);

  if (!notes) {
    return;
  }

  importNotes(notes);
}

function importCsv(filePath) {
  const notes = readNotes(filePath, parseCsv);

  if (!notes) {
    return;
  }

  importNotes(notes);
}

function importMarkdown(filePath) {
  const notes = readNotes(filePath, parseMarkdown);

  if (!notes) {
    return;
  }

  importNotes(notes);
}

module.exports = {
  importJson,
  importCsv,
  importMarkdown,
};
