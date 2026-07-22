const fs = require("fs");
const path = require("path");

const repository = require("../database/noteRepository");

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
        if (!err) {
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
    console.log("File not found.");
    return;
  }

  const notes = JSON.parse(fs.readFileSync(absolutePath, "utf8"));

  if (!Array.isArray(notes)) {
    console.log("Invalid JSON format.");
    return;
  }

  importNotes(notes);
}

function importCsv(filePath) {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    console.log("File not found.");
    return;
  }

  const content = fs.readFileSync(absolutePath, "utf8").trim();

  const lines = content.split(/\r?\n/);

  lines.shift();

  const notes = lines.map((line) => {
    const parts = line.split(",");

    return {
      id: Number(parts[0]),
      text: parts[1].replace(/^"|"$/g, "").replace(/""/g, '"'),
      priority: parts[2],
      tags: parts[3] ? parts[3].replace(/^"|"$/g, "").split(";").filter(Boolean) : [],
      dueDate: parts[4] || null,
      recurrence: parts[5] || null,
      completed: parts[6] === "true",
      createdAt: parts[7],
    };
  });

  importNotes(notes);
}

function importMarkdown(filePath) {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    console.log("File not found.");
    return;
  }

  const content = fs.readFileSync(absolutePath, "utf8");

  const sections = content.split("\n## ").slice(1);

  const notes = sections.map((section) => {
    const lines = section
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line !== "");

    const text = lines[0];

    const getValue = (line) => line.substring(line.indexOf(":") + 2);

    return {
      id: Number(getValue(lines[1])),
      text,
      priority: getValue(lines[2]),
      completed: getValue(lines[3]) === "true",
      dueDate: getValue(lines[4]) === "-" ? null : getValue(lines[4]),
      recurrence: getValue(lines[5]) === "-" ? null : getValue(lines[5]),
      tags: getValue(lines[6]) === "-" ? [] : getValue(lines[6]).split(", ").filter(Boolean),
      createdAt: getValue(lines[7]),
    };
  });

  importNotes(notes);
}

module.exports = {
  importJson,
  importCsv,
  importMarkdown,
};
