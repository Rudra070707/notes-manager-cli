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
const { printNotes } = require("../ui/table");
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

  test("should reject invalid due date", () => {
    service.addNote("Learn Express", "medium", "", "31-12-2026");

    expect(repository.getAllNotes).not.toHaveBeenCalled();
    expect(repository.addNote).not.toHaveBeenCalled();

    expect(ui.error).toHaveBeenCalledWith("✖ Invalid due date.");
    expect(ui.info).toHaveBeenCalledWith("Use format: YYYY-MM-DD");
  });

  test("should reject invalid recurrence", () => {
    service.addNote("Learn Express", "medium", "", null, "yearly");

    expect(repository.getAllNotes).not.toHaveBeenCalled();
    expect(repository.addNote).not.toHaveBeenCalled();

    expect(ui.error).toHaveBeenCalledWith("✖ Invalid recurrence.");
    expect(ui.info).toHaveBeenCalledWith(
      "Allowed values: daily, weekly, monthly"
    );
  });

  test("should handle database error while listing notes", () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(new Error("DB Error"));
    });

    service.listNotes();

    expect(ui.error).toHaveBeenCalledWith("✖ Failed to load notes.");
    expect(printNotes).not.toHaveBeenCalled();
  });

  test("should show warning when there are no notes", () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, []);
    });

    service.listNotes();

    expect(ui.heading).toHaveBeenCalled();
    expect(ui.divider).toHaveBeenCalled();
    expect(ui.warning).toHaveBeenCalledWith("No notes found.");
    expect(printNotes).not.toHaveBeenCalled();
  });

  test("should print notes when notes exist", () => {
    const notes = [
      {
        id: 1,
        text: "Learn Express",
        completed: false,
      },
    ];

    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, notes);
    });

    service.listNotes();

    expect(ui.heading).toHaveBeenCalled();
    expect(ui.divider).toHaveBeenCalled();
    expect(printNotes).toHaveBeenCalledWith(notes);
  });
  // ...keep all your existing mocks and the first 9 tests exactly as they are...

  // Add these three tests inside the same describe("Note Service", () => {

  test("should reject deleting an invalid note ID", () => {
    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, null);
    });

    service.deleteNote(1);

    expect(repository.deleteNote).not.toHaveBeenCalled();
    expect(ui.error).toHaveBeenCalledWith("✖ Invalid note ID.");
  });

  test("should handle delete database error", () => {
    const note = {
      id: 1,
      text: "Learn Express",
    };

    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, note);
    });

    repository.deleteNote.mockImplementation((id, callback) => {
      callback(new Error("DB Error"));
    });

    service.deleteNote(1);

    expect(ui.error).toHaveBeenCalledWith("✖ Failed to delete note.");
  });

  test("should delete a note successfully", () => {
    const note = {
      id: 1,
      text: "Learn Express",
    };

    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, note);
    });

    repository.deleteNote.mockImplementation((id, callback) => {
      callback(null);
    });

    service.deleteNote(1);

    expect(repository.deleteNote).toHaveBeenCalledWith(1, expect.any(Function));

    expect(ui.success).toHaveBeenCalledWith("✔ Deleted: Learn Express");
  });
  test("should reject updating with empty text", () => {
    service.updateNote(1, "");

    expect(repository.getAllNotes).not.toHaveBeenCalled();
    expect(repository.updateNote).not.toHaveBeenCalled();

    expect(ui.error).toHaveBeenCalledWith("✖ Please provide the updated note.");
  });

  test("should reject updating an invalid note ID", () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, []);
    });

    service.updateNote(1, "Updated Note");

    expect(repository.updateNote).not.toHaveBeenCalled();

    expect(ui.error).toHaveBeenCalledWith("✖ Invalid note ID.");
  });

  test("should reject updating to a duplicate note", () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, [
        {
          id: 1,
          text: "First Note",
        },
        {
          id: 2,
          text: "Second Note",
        },
      ]);
    });

    service.updateNote(1, "Second Note");

    expect(repository.updateNote).not.toHaveBeenCalled();

    expect(ui.warning).toHaveBeenCalledWith("⚠ Note already exists.");
  });

  test("should update a note successfully", () => {
    const notes = [
      {
        id: 1,
        text: "Old Note",
      },
    ];

    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, notes);
    });

    repository.updateNote.mockImplementation((note, callback) => {
      callback(null);
    });

    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    service.updateNote(1, "New Note");

    expect(repository.updateNote).toHaveBeenCalledTimes(1);

    expect(repository.updateNote).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        text: "New Note",
      }),
      expect.any(Function)
    );

    expect(ui.success).toHaveBeenCalledWith("✔ Note updated successfully!");

    expect(logSpy).toHaveBeenCalledWith('"Old Note"');
    expect(logSpy).toHaveBeenCalledWith('→ "New Note"');

    logSpy.mockRestore();
  });
  test("should reject completing an invalid note ID", () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, []);
    });

    service.completeNote(1);

    expect(repository.updateNote).not.toHaveBeenCalled();

    expect(ui.error).toHaveBeenCalledWith("✖ Invalid note ID.");
  });

  test("should reject completing an already completed note", () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, [
        {
          id: 1,
          text: "Learn Express",
          completed: true,
        },
      ]);
    });

    service.completeNote(1);

    expect(repository.updateNote).not.toHaveBeenCalled();

    expect(ui.warning).toHaveBeenCalledWith("⚠ Note is already completed.");
  });

  test("should complete a normal note successfully", () => {
    const notes = [
      {
        id: 1,
        text: "Learn Express",
        completed: false,
        recurrence: null,
        dueDate: null,
        priority: "medium",
        tags: [],
      },
    ];

    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, notes);
    });

    repository.updateNote.mockImplementation((note, callback) => {
      callback(null);
    });

    service.completeNote(1);

    expect(repository.updateNote).toHaveBeenCalledTimes(1);

    expect(repository.updateNote).toHaveBeenCalledWith(
      expect.objectContaining({
        completed: true,
      }),
      expect.any(Function)
    );

    expect(repository.addNote).not.toHaveBeenCalled();

    expect(ui.success).toHaveBeenCalledWith("✔ Completed: Learn Express");
  });
  test("should create the next daily recurring note", () => {
    const notes = [
      {
        id: 1,
        text: "Workout",
        completed: false,
        recurrence: "daily",
        dueDate: "2026-07-15",
        priority: "high",
        tags: ["health"],
      },
    ];

    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, notes);
    });

    repository.updateNote.mockImplementation((note, callback) => {
      callback(null);
    });

    repository.addNote.mockImplementation((note, callback) => {
      callback(null);
    });

    service.completeNote(1);

    expect(repository.updateNote).toHaveBeenCalledTimes(1);
    expect(repository.addNote).toHaveBeenCalledTimes(1);

    expect(repository.addNote).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 2,
        text: "Workout",
        recurrence: "daily",
        completed: false,
        dueDate: "2026-07-16",
      }),
      expect.any(Function)
    );

    expect(ui.success).toHaveBeenCalledWith("✔ Completed: Workout");
  });
  test("should create the next weekly recurring note", () => {
    const notes = [
      {
        id: 1,
        text: "Weekly Meeting",
        completed: false,
        recurrence: "weekly",
        dueDate: "2026-07-15",
        priority: "medium",
        tags: [],
      },
    ];

    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, notes);
    });

    repository.updateNote.mockImplementation((note, callback) => {
      callback(null);
    });

    repository.addNote.mockImplementation((note, callback) => {
      callback(null);
    });

    service.completeNote(1);

    expect(repository.addNote).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 2,
        text: "Weekly Meeting",
        recurrence: "weekly",
        dueDate: "2026-07-22",
        completed: false,
      }),
      expect.any(Function)
    );
  });
  test("should create the next monthly recurring note", () => {
    const notes = [
      {
        id: 1,
        text: "Monthly Report",
        completed: false,
        recurrence: "monthly",
        dueDate: "2026-07-15",
        priority: "medium",
        tags: [],
      },
    ];

    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, notes);
    });

    repository.updateNote.mockImplementation((note, callback) => {
      callback(null);
    });

    repository.addNote.mockImplementation((note, callback) => {
      callback(null);
    });

    service.completeNote(1);

    expect(repository.addNote).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 2,
        text: "Monthly Report",
        recurrence: "monthly",
        dueDate: "2026-08-15",
        completed: false,
      }),
      expect.any(Function)
    );
  });
  test("should reject uncompleting an invalid note ID", () => {
    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, null);
    });

    service.uncompleteNote(1);

    expect(repository.updateNote).not.toHaveBeenCalled();

    expect(ui.error).toHaveBeenCalledWith("✖ Invalid note ID.");
  });

  test("should handle database error while uncompleting a note", () => {
    const note = {
      id: 1,
      text: "Learn Express",
      completed: true,
    };

    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, note);
    });

    repository.updateNote.mockImplementation((note, callback) => {
      callback(new Error("DB Error"));
    });

    service.uncompleteNote(1);

    expect(ui.error).toHaveBeenCalledWith("✖ Failed to update note.");
  });

  test("should mark a completed note as pending", () => {
    const note = {
      id: 1,
      text: "Learn Express",
      completed: true,
    };

    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, note);
    });

    repository.updateNote.mockImplementation((note, callback) => {
      callback(null);
    });

    service.uncompleteNote(1);

    expect(repository.updateNote).toHaveBeenCalledWith(
      expect.objectContaining({
        completed: false,
      }),
      expect.any(Function)
    );

    expect(ui.success).toHaveBeenCalledWith(
      "✔ Marked as pending: Learn Express"
    );
  });
  test("should handle database error while clearing notes", () => {
    repository.clearNotes.mockImplementation((callback) => {
      callback(new Error("DB Error"));
    });

    service.clearNotes();

    expect(ui.error).toHaveBeenCalledWith("✖ Failed to clear notes.");
  });

  test("should clear all notes successfully", () => {
    repository.clearNotes.mockImplementation((callback) => {
      callback(null);
    });

    service.clearNotes();

    expect(repository.clearNotes).toHaveBeenCalledTimes(1);

    expect(ui.success).toHaveBeenCalledWith("✔ All notes have been deleted.");
  });
  test("should reject searching with an empty keyword", () => {
    service.searchNotes("");

    expect(repository.getAllNotes).not.toHaveBeenCalled();

    expect(ui.error).toHaveBeenCalledWith("✖ Please provide a keyword.");
  });

  test("should handle database error while searching notes", () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(new Error("DB Error"));
    });

    service.searchNotes("express");

    expect(ui.error).toHaveBeenCalledWith("✖ Failed to load notes.");
  });

  test("should show warning when no matching notes are found", () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, [
        {
          id: 1,
          text: "Learn Node",
        },
      ]);
    });

    service.searchNotes("python");

    expect(ui.heading).toHaveBeenCalled();
    expect(ui.divider).toHaveBeenCalled();

    expect(ui.warning).toHaveBeenCalledWith("No matching notes found.");
  });

  test("should print matching search results", () => {
    const notes = [
      {
        id: 1,
        text: "Learn Express",
      },
      {
        id: 2,
        text: "Learn React",
      },
    ];

    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, notes);
    });

    service.searchNotes("express");

    expect(ui.heading).toHaveBeenCalled();
    expect(ui.divider).toHaveBeenCalled();

    expect(printNotes).toHaveBeenCalledWith([notes[0]]);
  });
  test("should handle database error while showing statistics", () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(new Error("DB Error"));
    });

    service.showStats();

    expect(ui.error).toHaveBeenCalledWith("✖ Failed to load notes.");
  });

  test("should display note statistics", () => {
    const notes = [
      {
        id: 1,
        completed: true,
      },
      {
        id: 2,
        completed: false,
      },
      {
        id: 3,
        completed: true,
      },
    ];

    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, notes);
    });

    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    service.showStats();

    expect(ui.heading).toHaveBeenCalled();
    expect(ui.divider).toHaveBeenCalled();

    expect(logSpy).toHaveBeenCalledWith("Total Notes     : 3");
    expect(logSpy).toHaveBeenCalledWith("Completed Notes : 2");
    expect(logSpy).toHaveBeenCalledWith("Pending Notes   : 1");
    expect(logSpy).toHaveBeenCalledWith("Completion Rate : 66.67%");

    logSpy.mockRestore();
  });
});
