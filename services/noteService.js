const { filterNotes } = require("../filters/noteFilter");
const { sortNotes } = require("../sorters/noteSorter");
const { validatePriority } = require("../validators/priorityValidator");
const { validateTag } = require("../validators/tagValidator");
const { validateDueDate } = require("../validators/dueDateValidator");
const { validateRecurrence } = require("../validators/recurrenceValidator");
const { loadNotes, saveNotes } = require("../utils/file");
const ui = require("../ui/colors");
const { printNotes } = require("../ui/table");
const { validateText } = require("../validators/textValidator");

function addNote(text, priority = "medium", tag = "", dueDate = null, recurrence = null) {
  if (!validateText(text)) {
    ui.error("✖ Please provide a note.");
    ui.info('Example: notes add "Learn Express"');
    return;
  }

  const validatedPriority = validatePriority(priority);

  if (!validatedPriority) {
    ui.error("✖ Invalid priority.");
    ui.info("Allowed values: low, medium, high");
    return;
  }

  const tags = validateTag(tag);

  const validatedDueDate = validateDueDate(dueDate);

  if (dueDate && !validatedDueDate) {
    ui.error("✖ Invalid due date.");
    ui.info("Use format: YYYY-MM-DD");
    return;
  }

  const validatedRecurrence = validateRecurrence(recurrence);

  if (recurrence && !validatedRecurrence) {
    ui.error("✖ Invalid recurrence.");
    ui.info("Allowed values: daily, weekly, monthly");
    return;
  }

  const notes = loadNotes();

  const exists = notes.some((note) => note.text.toLowerCase() === text.trim().toLowerCase());

  if (exists) {
    ui.warning("⚠ Note already exists.");
    return;
  }

  const nextId = notes.length === 0 ? 1 : Math.max(...notes.map((note) => note.id)) + 1;

  const newNote = {
    id: nextId,
    text: text.trim(),
    priority: validatedPriority,
    tags,
    dueDate: validatedDueDate,
    recurrence: validatedRecurrence,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  notes.push(newNote);

  saveNotes(notes);

  ui.success("✔ Note added successfully!");
}

function listNotes(options = {}) {
  const notes = loadNotes();

  const filtered = filterNotes(notes, options);

  const sorted = sortNotes(filtered, options.sort);

  ui.heading("\nNotes");
  ui.divider();

  if (sorted.length === 0) {
    ui.warning("No notes found.");
    return;
  }

  printNotes(sorted);
}

function deleteNote(id) {
  const notes = loadNotes();

  const index = notes.findIndex((note) => note.id === Number(id));

  if (index === -1) {
    ui.error("✖ Invalid note ID.");
    return;
  }

  const deleted = notes[index];

  notes.splice(index, 1);

  saveNotes(notes);

  ui.success(`✔ Deleted: ${deleted.text}`);
}

function updateNote(id, newText) {
  if (!validateText(newText)) {
    ui.error("✖ Please provide the updated note.");
    return;
  }

  const notes = loadNotes();

  const note = notes.find((note) => note.id === Number(id));

  if (!note) {
    ui.error("✖ Invalid note ID.");
    return;
  }

  const exists = notes.some(
    (n) => n.id !== note.id && n.text.toLowerCase() === newText.trim().toLowerCase()
  );

  if (exists) {
    ui.warning("⚠ Note already exists.");
    return;
  }

  const oldText = note.text;

  note.text = newText.trim();

  saveNotes(notes);

  ui.success("✔ Note updated successfully!");
  console.log(`"${oldText}"`);
  console.log(`→ "${note.text}"`);
}

function completeNote(id) {
  const notes = loadNotes();

  const note = notes.find((note) => note.id === Number(id));

  if (!note) {
    ui.error("✖ Invalid note ID.");
    return;
  }

  if (note.completed) {
    ui.warning("⚠ Note is already completed.");
    return;
  }

  note.completed = true;

  if (note.recurrence) {
    const nextId = Math.max(...notes.map((n) => n.id)) + 1;

    let nextDueDate = note.dueDate;

    if (note.dueDate) {
      const date = new Date(note.dueDate);

      switch (note.recurrence) {
        case "daily":
          date.setDate(date.getDate() + 1);
          break;

        case "weekly":
          date.setDate(date.getDate() + 7);
          break;

        case "monthly":
          date.setMonth(date.getMonth() + 1);
          break;
      }

      nextDueDate = date.toISOString().split("T")[0];
    }

    notes.push({
      id: nextId,
      text: note.text,
      priority: note.priority,
      tags: [...note.tags],
      dueDate: nextDueDate,
      recurrence: note.recurrence,
      completed: false,
      createdAt: new Date().toISOString(),
    });
  }

  saveNotes(notes);

  ui.success(`✔ Completed: ${note.text}`);
}

function uncompleteNote(id) {
  const notes = loadNotes();

  const note = notes.find((note) => note.id === Number(id));

  if (!note) {
    ui.error("✖ Invalid note ID.");
    return;
  }

  note.completed = false;

  saveNotes(notes);

  ui.success(`✔ Marked as pending: ${note.text}`);
}

function clearNotes() {
  saveNotes([]);

  ui.success("✔ All notes have been deleted.");
}

function searchNotes(keyword) {
  if (!keyword) {
    ui.error("✖ Please provide a keyword.");
    return;
  }

  const notes = loadNotes();

  const results = notes.filter((note) => note.text.toLowerCase().includes(keyword.toLowerCase()));

  ui.heading("\nSearch Results");
  ui.divider();

  if (results.length === 0) {
    ui.warning("No matching notes found.");
    return;
  }

  printNotes(results);
}

function showStats() {
  const notes = loadNotes();

  const total = notes.length;
  const completed = notes.filter((note) => note.completed).length;
  const pending = total - completed;

  const completionRate = total === 0 ? 0 : ((completed / total) * 100).toFixed(2);

  ui.heading("\nNotes Statistics");
  ui.divider();

  console.log(`Total Notes     : ${total}`);
  console.log(`Completed Notes : ${completed}`);
  console.log(`Pending Notes   : ${pending}`);
  console.log(`Completion Rate : ${completionRate}%`);
}

module.exports = {
  addNote,
  listNotes,
  deleteNote,
  updateNote,
  completeNote,
  uncompleteNote,
  clearNotes,
  searchNotes,
  showStats,
};
