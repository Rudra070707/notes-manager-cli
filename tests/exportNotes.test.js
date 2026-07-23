jest.mock("../database/noteRepository", () => ({
  getAllNotes: jest.fn(),
}));

const fs = require("fs");

const repository = require("../database/noteRepository");
const exportService = require("../services/exportService");

describe("exportNotes()", () => {
  const sampleNotes = [
    {
      id: "1",
      text: "Learn Jest",
      priority: "High",
      tags: ["study"],
      dueDate: "",
      recurrence: "",
      completed: false,
      createdAt: "2026-07-15",
    },
  ];

  afterEach(() => {
    jest.restoreAllMocks();

    if (fs.existsSync(exportService.EXPORT_DIRECTORY)) {
      fs.rmSync(exportService.EXPORT_DIRECTORY, {
        recursive: true,
        force: true,
      });
    }
  });

  test("should export notes successfully", () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, sampleNotes);
    });

    jest.spyOn(console, "log").mockImplementation(() => {});

    exportService.exportNotes("json");

    expect(repository.getAllNotes).toHaveBeenCalledTimes(1);

    expect(fs.existsSync(exportService.EXPORT_DIRECTORY)).toBe(true);

    const files = fs.readdirSync(exportService.EXPORT_DIRECTORY);

    expect(files.length).toBe(1);
    expect(files[0]).toMatch(/^notes-.*\.json$/);
  });

  test("should handle repository error", () => {
    const error = new Error("Database failed");

    repository.getAllNotes.mockImplementation((callback) => {
      callback(error);
    });

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    exportService.exportNotes("json");

    expect(repository.getAllNotes).toHaveBeenCalledTimes(1);

    expect(errorSpy).toHaveBeenCalledWith("Error:", "Database failed");
  });

  test("should handle unsupported export format", () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, sampleNotes);
    });

    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    exportService.exportNotes("xml");

    expect(repository.getAllNotes).toHaveBeenCalledTimes(1);

    expect(logSpy).toHaveBeenCalledWith("Unsupported export format.");

    expect(fs.existsSync(exportService.EXPORT_DIRECTORY)).toBe(true);

    const files = fs.readdirSync(exportService.EXPORT_DIRECTORY);

    expect(files.length).toBe(0);
  });
});
