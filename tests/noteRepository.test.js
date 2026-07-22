const {
  addNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  clearNotes,
} = require("../database/noteRepository");

describe("Note Repository", () => {
  const sampleNote = {
    id: 1,
    text: "Learn Jest",
    priority: "medium",
    tags: ["node", "testing"],
    dueDate: null,
    recurrence: null,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  test("should add a note", (done) => {
    addNote(sampleNote, (err) => {
      expect(err).toBeNull();

      getAllNotes((err, notes) => {
        expect(err).toBeNull();
        expect(notes).toHaveLength(1);
        expect(notes[0].text).toBe("Learn Jest");
        expect(notes[0].completed).toBe(false);
        done();
      });
    });
  });

  test("should get note by id", (done) => {
    addNote(sampleNote, (err) => {
      expect(err).toBeNull();

      getNoteById(1, (err, note) => {
        expect(err).toBeNull();
        expect(note).not.toBeNull();
        expect(note.id).toBe(1);
        expect(note.text).toBe("Learn Jest");
        done();
      });
    });
  });

  test("should update a note", (done) => {
    addNote(sampleNote, (err) => {
      expect(err).toBeNull();

      const updatedNote = {
        ...sampleNote,
        text: "Updated Note",
        priority: "high",
        completed: true,
      };

      updateNote(updatedNote, (err) => {
        expect(err).toBeNull();

        getNoteById(1, (err, note) => {
          expect(err).toBeNull();
          expect(note.text).toBe("Updated Note");
          expect(note.priority).toBe("high");
          expect(note.completed).toBe(true);
          done();
        });
      });
    });
  });

  test("should delete a note", (done) => {
    addNote(sampleNote, (err) => {
      expect(err).toBeNull();

      deleteNote(1, (err) => {
        expect(err).toBeNull();

        getAllNotes((err, notes) => {
          expect(err).toBeNull();
          expect(notes).toHaveLength(0);
          done();
        });
      });
    });
  });

  test("should clear all notes", (done) => {
    addNote(sampleNote, (err) => {
      expect(err).toBeNull();

      clearNotes((err) => {
        expect(err).toBeNull();

        getAllNotes((err, notes) => {
          expect(err).toBeNull();
          expect(notes).toHaveLength(0);
          done();
        });
      });
    });
  });
});
