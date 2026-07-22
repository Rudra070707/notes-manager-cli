jest.mock("../ui/colors", () => ({
  success: jest.fn(),
  error: jest.fn(),
  warning: jest.fn(),
  info: jest.fn(),
  heading: jest.fn(),
  divider: jest.fn(),
}));

jest.mock("../ui/table", () => ({
  printNotes: jest.fn(),
}));

jest.mock("../database/noteRepository", () => ({
  getAllNotes: jest.fn(),
  getNoteById: jest.fn(),
  addNote: jest.fn(),
  updateNote: jest.fn(),
  deleteNote: jest.fn(),
  clearNotes: jest.fn(),
}));

const ui = require("../ui/colors");
const repository = require("../database/noteRepository");
const service = require("../services/noteService");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Note Service", () => {
  test("should add a valid note", () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, []);
    });

    repository.addNote.mockImplementation((note, callback) => {
      callback(null);
    });

    service.addNote("Learn Express");

    expect(repository.getAllNotes).toHaveBeenCalledTimes(1);
    expect(repository.addNote).toHaveBeenCalledTimes(1);
    expect(ui.success).toHaveBeenCalledWith("✔ Note added successfully!");
  });

  test("should reject an empty note", () => {
    service.addNote("");

    expect(repository.getAllNotes).not.toHaveBeenCalled();
    expect(repository.addNote).not.toHaveBeenCalled();
    expect(ui.error).toHaveBeenCalled();
  });

  test("should reject duplicate notes", () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, [
        {
          id: 1,
          text: "Learn Express",
        },
      ]);
    });

    service.addNote("Learn Express");

    expect(repository.addNote).not.toHaveBeenCalled();
    expect(ui.warning).toHaveBeenCalledWith("⚠ Note already exists.");
  });

  test("should reject invalid priority", () => {
    service.addNote("Learn Express", "super-high");

    expect(repository.getAllNotes).not.toHaveBeenCalled();
    expect(repository.addNote).not.toHaveBeenCalled();
    expect(ui.error).toHaveBeenCalled();
  });
});
