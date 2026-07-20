const fs = require("fs");
const path = require("path");

const TEST_FILE = path.join(__dirname, "test-notes.json");

beforeEach(() => {
  process.env.NOTES_FILE = TEST_FILE;

  if (fs.existsSync(TEST_FILE)) {
    fs.unlinkSync(TEST_FILE);
  }

  jest.resetModules();
});

afterEach(() => {
  if (fs.existsSync(TEST_FILE)) {
    fs.unlinkSync(TEST_FILE);
  }

  delete process.env.NOTES_FILE;
});

test("loadNotes returns empty array when file does not exist", () => {
  const { loadNotes } = require("../utils/file");

  expect(loadNotes()).toEqual([]);
});

test("saveNotes writes notes correctly", () => {
  const { saveNotes, loadNotes } = require("../utils/file");

  const notes = [
    {
      id: 1,
      text: "Learn Jest",
      completed: false,
    },
  ];

  saveNotes(notes);

  expect(loadNotes()).toEqual(notes);
});
