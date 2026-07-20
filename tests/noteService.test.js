const fs = require("fs");
const path = require("path");

const TEST_FILE = path.join(__dirname, "test-notes.json");

beforeEach(() => {
  process.env.NOTES_FILE = TEST_FILE;

  if (fs.existsSync(TEST_FILE)) {
    fs.unlinkSync(TEST_FILE);
  }

  jest.resetModules();

  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  if (fs.existsSync(TEST_FILE)) {
    fs.unlinkSync(TEST_FILE);
  }

  delete process.env.NOTES_FILE;

  console.log.mockRestore();
});

test("addNote creates a new note", () => {
  const { addNote } = require("../services/noteService");
  const { loadNotes } = require("../utils/file");

  addNote("Learn Jest");

  const notes = loadNotes();

  expect(notes).toHaveLength(1);
  expect(notes[0].text).toBe("Learn Jest");
  expect(notes[0].completed).toBe(false);
});

test("duplicate note is not added", () => {
  const { addNote } = require("../services/noteService");
  const { loadNotes } = require("../utils/file");

  addNote("JavaScript");
  addNote("JavaScript");

  expect(loadNotes()).toHaveLength(1);
});

test("deleteNote removes a note", () => {
  const { addNote, deleteNote } = require("../services/noteService");
  const { loadNotes } = require("../utils/file");

  addNote("Delete Me");
  deleteNote(1);

  expect(loadNotes()).toEqual([]);
});

test("delete invalid id changes nothing", () => {
  const { addNote, deleteNote } = require("../services/noteService");
  const { loadNotes } = require("../utils/file");

  addNote("Node");

  deleteNote(99);

  expect(loadNotes()).toHaveLength(1);
});

test("updateNote updates the note text", () => {
  const { addNote, updateNote } = require("../services/noteService");
  const { loadNotes } = require("../utils/file");

  addNote("Old Note");
  updateNote(1, "New Note");

  expect(loadNotes()[0].text).toBe("New Note");
});

test("update invalid id changes nothing", () => {
  const { addNote, updateNote } = require("../services/noteService");
  const { loadNotes } = require("../utils/file");

  addNote("Node");

  updateNote(99, "Changed");

  expect(loadNotes()[0].text).toBe("Node");
});

test("completeNote marks a note as completed", () => {
  const { addNote, completeNote } = require("../services/noteService");
  const { loadNotes } = require("../utils/file");

  addNote("Finish Assignment");
  completeNote(1);

  expect(loadNotes()[0].completed).toBe(true);
});

test("complete invalid id changes nothing", () => {
  const { addNote, completeNote } = require("../services/noteService");
  const { loadNotes } = require("../utils/file");

  addNote("Node");

  completeNote(99);

  expect(loadNotes()[0].completed).toBe(false);
});

test("uncompleteNote marks a completed note as pending", () => {
  const { addNote, completeNote, uncompleteNote } = require("../services/noteService");
  const { loadNotes } = require("../utils/file");

  addNote("Study");
  completeNote(1);
  uncompleteNote(1);

  expect(loadNotes()[0].completed).toBe(false);
});

test("uncomplete invalid id changes nothing", () => {
  const { addNote, uncompleteNote } = require("../services/noteService");
  const { loadNotes } = require("../utils/file");

  addNote("Node");

  uncompleteNote(99);

  expect(loadNotes()[0].completed).toBe(false);
});

test("clearNotes removes every note", () => {
  const { addNote, clearNotes } = require("../services/noteService");
  const { loadNotes } = require("../utils/file");

  addNote("One");
  addNote("Two");

  clearNotes();

  expect(loadNotes()).toEqual([]);
});
