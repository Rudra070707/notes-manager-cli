jest.mock('../ui/colors', () => ({
  success: jest.fn(),
  error: jest.fn(),
  warning: jest.fn(),
  info: jest.fn(),
  heading: jest.fn(),
  divider: jest.fn(),
}));

jest.mock('../ui/table', () => ({
  printNotes: jest.fn(),
}));

jest.mock('../database/noteRepository', () => ({
  getAllNotes: jest.fn(),
  getArchivedNotes: jest.fn(),
  getTrashedNotes: jest.fn(),
  getFavoriteNotes: jest.fn(),
  getNoteById: jest.fn(),

  addNote: jest.fn(),
  addNoteDirect: jest.fn(),
  updateNote: jest.fn(),

  archiveNote: jest.fn(),
  restoreArchivedNote: jest.fn(),
  clearArchivedNotes: jest.fn(),

  moveToTrash: jest.fn(),
  restoreFromTrash: jest.fn(),
  emptyTrash: jest.fn(),

  lockNote: jest.fn(),
  unlockNote: jest.fn(),
  pinNote: jest.fn(),
  unpinNote: jest.fn(),
  favoriteNote: jest.fn(),
  unfavoriteNote: jest.fn(),
  setCategory: jest.fn(),
  getCategories: jest.fn(),
  renameCategory: jest.fn(),
  deleteCategory: jest.fn(),
  deleteNote: jest.fn(),
  clearNotes: jest.fn(),
}));
jest.mock('../database/undoRepository', () => ({
  saveUndo: jest.fn(),
  getLastUndo: jest.fn(),
  deleteLastUndo: jest.fn(),
}));
jest.mock('../services/loggerService', () => ({
  log: jest.fn(),
}));
const ui = require('../ui/colors');
const { printNotes } = require('../ui/table');
const repository = require('../database/noteRepository');
const undoRepository = require('../database/undoRepository');
const service = require('../services/noteService');

beforeEach(() => {
  jest.clearAllMocks();

  undoRepository.saveUndo.mockImplementation((operation, payload, callback) => {
    if (typeof callback === 'function') {
      callback(null);
    }
  });
});

describe('Note Service', () => {
  test('should add a valid note', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, []);
    });

    repository.addNote.mockImplementation((note, callback) => {
      callback(null);
    });

    service.addNote('Learn Express');

    expect(repository.getAllNotes).toHaveBeenCalledTimes(1);
    expect(repository.addNote).toHaveBeenCalledTimes(1);
    expect(ui.success).toHaveBeenCalledWith('✔ Note added successfully!');
  });

  test('should reject an empty note', () => {
    service.addNote('');

    expect(repository.getAllNotes).not.toHaveBeenCalled();
    expect(repository.addNote).not.toHaveBeenCalled();
    expect(ui.error).toHaveBeenCalled();
  });

  test('should reject duplicate notes', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, [
        {
          id: 1,
          text: 'Learn Express',
        },
      ]);
    });

    service.addNote('Learn Express');

    expect(repository.addNote).not.toHaveBeenCalled();
    expect(ui.warning).toHaveBeenCalledWith('⚠ Note already exists.');
  });

  test('should reject invalid priority', () => {
    service.addNote('Learn Express', 'super-high');

    expect(repository.getAllNotes).not.toHaveBeenCalled();
    expect(repository.addNote).not.toHaveBeenCalled();
    expect(ui.error).toHaveBeenCalled();
  });

  test('should reject invalid due date', () => {
    service.addNote('Learn Express', 'medium', '', '31-12-2026');

    expect(repository.getAllNotes).not.toHaveBeenCalled();
    expect(repository.addNote).not.toHaveBeenCalled();

    expect(ui.error).toHaveBeenCalledWith('✖ Invalid due date.');
    expect(ui.info).toHaveBeenCalledWith('Use format: YYYY-MM-DD');
  });

  test('should reject invalid recurrence', () => {
    service.addNote('Learn Express', 'medium', '', null, 'yearly');

    expect(repository.getAllNotes).not.toHaveBeenCalled();
    expect(repository.addNote).not.toHaveBeenCalled();

    expect(ui.error).toHaveBeenCalledWith('✖ Invalid recurrence.');
    expect(ui.info).toHaveBeenCalledWith(
      'Allowed values: daily, weekly, monthly'
    );
  });

  test('should handle database error while listing notes', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(new Error('DB Error'));
    });

    service.listNotes();

    expect(ui.error).toHaveBeenCalledWith('✖ Failed to load notes.');
    expect(printNotes).not.toHaveBeenCalled();
  });

  test('should show warning when there are no notes', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, []);
    });

    service.listNotes();

    expect(ui.heading).toHaveBeenCalled();
    expect(ui.divider).toHaveBeenCalled();
    expect(ui.warning).toHaveBeenCalledWith('No notes found.');
    expect(printNotes).not.toHaveBeenCalled();
  });

  test('should print notes when notes exist', () => {
    const notes = [
      {
        id: 1,
        text: 'Learn Express',
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

  test('should reject deleting an invalid note ID', () => {
    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, null);
    });

    service.deleteNote(1);

    expect(repository.deleteNote).not.toHaveBeenCalled();
    expect(ui.error).toHaveBeenCalledWith('✖ Invalid note ID.');
  });

  test('should handle delete database error', () => {
    const note = {
      id: 1,
      text: 'Learn Express',
    };

    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, note);
    });

    repository.moveToTrash.mockImplementation((id, callback) => {
      callback(new Error('DB Error'));
    });

    service.deleteNote(1);
    expect(ui.error).toHaveBeenCalledWith('✖ Failed to move note to Trash.');
  });

  test('should delete a note successfully', () => {
    const note = {
      id: 1,
      text: 'Learn Express',
    };

    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, note);
    });

    repository.moveToTrash.mockImplementation((id, callback) => {
      callback(null);
    });

    service.deleteNote(1);

    expect(repository.moveToTrash).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );

    expect(ui.success).toHaveBeenCalledWith('✔ Moved to Trash: Learn Express');
  });

  test('should reject updating with empty text', () => {
    service.updateNote(1, '');

    expect(repository.getAllNotes).not.toHaveBeenCalled();
    expect(repository.updateNote).not.toHaveBeenCalled();

    expect(ui.error).toHaveBeenCalledWith('✖ Please provide the updated note.');
  });

  test('should reject updating an invalid note ID', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, []);
    });

    service.updateNote(1, 'Updated Note');

    expect(repository.updateNote).not.toHaveBeenCalled();

    expect(ui.error).toHaveBeenCalledWith('✖ Invalid note ID.');
  });

  test('should reject updating to a duplicate note', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, [
        {
          id: 1,
          text: 'First Note',
        },
        {
          id: 2,
          text: 'Second Note',
        },
      ]);
    });

    service.updateNote(1, 'Second Note');

    expect(repository.updateNote).not.toHaveBeenCalled();

    expect(ui.warning).toHaveBeenCalledWith('⚠ Note already exists.');
  });

  test('should update a note successfully', () => {
    const notes = [
      {
        id: 1,
        text: 'Old Note',
      },
    ];

    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, notes);
    });

    repository.updateNote.mockImplementation((note, callback) => {
      callback(null);
    });

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    service.updateNote(1, 'New Note');

    expect(repository.updateNote).toHaveBeenCalledTimes(1);

    expect(repository.updateNote).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        text: 'New Note',
      }),
      expect.any(Function)
    );

    expect(ui.success).toHaveBeenCalledWith('✔ Note updated successfully!');

    expect(logSpy).toHaveBeenCalledWith('"Old Note"');
    expect(logSpy).toHaveBeenCalledWith('→ "New Note"');

    logSpy.mockRestore();
  });

  test('should reject completing an invalid note ID', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, []);
    });

    service.completeNote(1);

    expect(repository.updateNote).not.toHaveBeenCalled();

    expect(ui.error).toHaveBeenCalledWith('✖ Invalid note ID.');
  });

  test('should reject completing an already completed note', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, [
        {
          id: 1,
          text: 'Learn Express',
          completed: true,
        },
      ]);
    });

    service.completeNote(1);

    expect(repository.updateNote).not.toHaveBeenCalled();

    expect(ui.warning).toHaveBeenCalledWith('⚠ Note is already completed.');
  });

  test('should complete a normal note successfully', () => {
    const notes = [
      {
        id: 1,
        text: 'Learn Express',
        completed: false,
        recurrence: null,
        dueDate: null,
        priority: 'medium',
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

    expect(ui.success).toHaveBeenCalledWith('✔ Completed: Learn Express');
  });

  test('should create the next daily recurring note', () => {
    const notes = [
      {
        id: 1,
        text: 'Workout',
        completed: false,
        recurrence: 'daily',
        dueDate: '2026-07-15',
        priority: 'high',
        tags: ['health'],
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
        text: 'Workout',
        recurrence: 'daily',
        completed: false,
        dueDate: '2026-07-16',
      }),
      expect.any(Function)
    );

    expect(ui.success).toHaveBeenCalledWith('✔ Completed: Workout');
  });

  test('should create the next weekly recurring note', () => {
    const notes = [
      {
        id: 1,
        text: 'Weekly Meeting',
        completed: false,
        recurrence: 'weekly',
        dueDate: '2026-07-15',
        priority: 'medium',
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
        text: 'Weekly Meeting',
        recurrence: 'weekly',
        dueDate: '2026-07-22',
        completed: false,
      }),
      expect.any(Function)
    );
  });

  test('should create the next monthly recurring note', () => {
    const notes = [
      {
        id: 1,
        text: 'Monthly Report',
        completed: false,
        recurrence: 'monthly',
        dueDate: '2026-07-15',
        priority: 'medium',
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
        text: 'Monthly Report',
        recurrence: 'monthly',
        dueDate: '2026-08-15',
        completed: false,
      }),
      expect.any(Function)
    );
  });

  test('should reject uncompleting an invalid note ID', () => {
    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, null);
    });

    service.uncompleteNote(1);

    expect(repository.updateNote).not.toHaveBeenCalled();

    expect(ui.error).toHaveBeenCalledWith('✖ Invalid note ID.');
  });

  test('should handle database error while uncompleting a note', () => {
    const note = {
      id: 1,
      text: 'Learn Express',
      completed: true,
    };

    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, note);
    });

    repository.updateNote.mockImplementation((note, callback) => {
      callback(new Error('DB Error'));
    });

    service.uncompleteNote(1);

    expect(ui.error).toHaveBeenCalledWith('✖ Failed to update note.');
  });

  test('should mark a completed note as pending', () => {
    const note = {
      id: 1,
      text: 'Learn Express',
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
      '✔ Marked as pending: Learn Express'
    );
  });

  test('should handle database error while clearing notes', () => {
    repository.clearNotes.mockImplementation((callback) => {
      callback(new Error('DB Error'));
    });

    service.clearNotes();

    expect(ui.error).toHaveBeenCalledWith('✖ Failed to clear notes.');
  });

  test('should clear all notes successfully', () => {
    repository.clearNotes.mockImplementation((callback) => {
      callback(null);
    });

    service.clearNotes();

    expect(repository.clearNotes).toHaveBeenCalledTimes(1);

    expect(ui.success).toHaveBeenCalledWith('✔ All notes have been deleted.');
  });

  test('should reject searching with an empty keyword', () => {
    service.searchNotes('');

    expect(repository.getAllNotes).not.toHaveBeenCalled();

    expect(ui.error).toHaveBeenCalledWith('✖ Please provide a keyword.');
  });

  test('should handle database error while searching notes', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(new Error('DB Error'));
    });

    service.searchNotes('express');

    expect(ui.error).toHaveBeenCalledWith('✖ Failed to load notes.');
  });

  test('should show warning when no matching notes are found', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, [
        {
          id: 1,
          text: 'Learn Node',
        },
      ]);
    });

    service.searchNotes('python');

    expect(ui.heading).toHaveBeenCalled();
    expect(ui.divider).toHaveBeenCalled();

    expect(ui.warning).toHaveBeenCalledWith('No matching notes found.');
  });

  test('should print matching search results', () => {
    const notes = [
      {
        id: 1,
        text: 'Learn Express',
      },
      {
        id: 2,
        text: 'Learn React',
      },
    ];

    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, notes);
    });

    service.searchNotes('express');

    expect(ui.heading).toHaveBeenCalled();
    expect(ui.divider).toHaveBeenCalled();

    expect(printNotes).toHaveBeenCalledWith([notes[0]]);
  });

  test('should handle database error while showing statistics', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(new Error('DB Error'));
    });

    service.showStats();

    expect(ui.error).toHaveBeenCalledWith('✖ Failed to load notes.');
  });

  test('should generate report', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, [
        {
          id: 1,
          completed: true,
          priority: 'high',
        },
      ]);
    });

    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

    service.generateReport();

    expect(repository.getAllNotes).toHaveBeenCalledTimes(1);

    spy.mockRestore();
  });

  test('should show next task', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, [
        {
          id: 1,
          text: 'Study',
          priority: 'high',
          completed: false,
        },
      ]);
    });

    service.showNextTask();

    expect(repository.getAllNotes).toHaveBeenCalledTimes(1);
  });

  test('should show today notes', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, []);
    });

    service.listTodayNotes();

    expect(repository.getAllNotes).toHaveBeenCalledTimes(1);
  });

  test('should show upcoming notes', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, []);
    });

    service.listUpcomingNotes();

    expect(repository.getAllNotes).toHaveBeenCalledTimes(1);
  });

  test('should show overdue notes', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, []);
    });

    service.listOverdueNotes();

    expect(repository.getAllNotes).toHaveBeenCalledTimes(1);
  });

  test('should display note statistics', () => {
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

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    service.showStats();

    expect(ui.heading).toHaveBeenCalled();
    expect(ui.divider).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('📄 Total Notes            : 3');
    expect(logSpy).toHaveBeenCalledWith('✅ Completed              : 2');
    expect(logSpy).toHaveBeenCalledWith('📝 Pending                : 1');
    expect(logSpy).toHaveBeenCalledWith('📊 Completion Rate        : 66.67%');

    logSpy.mockRestore();
  });

  test('should archive a note successfully', () => {
    const note = {
      id: 1,
      text: 'Learn Express',
      archived: false,
    };

    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, note);
    });

    repository.archiveNote.mockImplementation((id, callback) => {
      callback(null);
    });

    service.archiveNote(1);

    expect(repository.archiveNote).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );

    expect(ui.success).toHaveBeenCalledWith('✔ Archived: Learn Express');
  });

  test('should list archived notes', () => {
    const notes = [
      {
        id: 1,
        text: 'Archived Note',
        archived: true,
      },
    ];

    repository.getArchivedNotes.mockImplementation((callback) => {
      callback(null, notes);
    });

    service.listArchivedNotes();

    expect(ui.heading).toHaveBeenCalled();
    expect(ui.divider).toHaveBeenCalled();
    expect(printNotes).toHaveBeenCalledWith(notes);
  });

  test('should restore an archived note', () => {
    const note = {
      id: 1,
      text: 'Archived Note',
      archived: true,
    };

    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, note);
    });

    repository.restoreArchivedNote.mockImplementation((id, callback) => {
      callback(null);
    });

    service.restoreArchivedNote(1);

    expect(repository.restoreArchivedNote).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );

    expect(ui.success).toHaveBeenCalledWith('✔ Restored: Archived Note');
  });

  test('should clear archived notes', () => {
    repository.clearArchivedNotes.mockImplementation((callback) => {
      callback(null);
    });

    service.clearArchivedNotes();

    expect(repository.clearArchivedNotes).toHaveBeenCalledTimes(1);

    expect(ui.success).toHaveBeenCalledWith('✔ Archived notes cleared.');
  });

  test('should list trashed notes', () => {
    const notes = [
      {
        id: 1,
        text: 'Deleted Note',
        is_trashed: true,
      },
    ];

    repository.getTrashedNotes.mockImplementation((callback) => {
      callback(null, notes);
    });

    service.listTrashedNotes();

    expect(repository.getTrashedNotes).toHaveBeenCalledTimes(1);
    expect(printNotes).toHaveBeenCalledWith(notes);
  });

  test('should restore a trashed note', () => {
    const note = {
      id: 1,
      text: 'Deleted Note',
      is_trashed: true,
    };

    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, note);
    });

    repository.restoreFromTrash.mockImplementation((id, callback) => {
      callback(null);
    });

    service.restoreTrashedNote(1);

    expect(repository.restoreFromTrash).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );

    expect(ui.success).toHaveBeenCalledWith(
      '✔ Restored from Trash: Deleted Note'
    );
  });

  test('should empty trash successfully', () => {
    repository.emptyTrash.mockImplementation((callback) => {
      callback(null);
    });

    service.emptyTrashBin();

    expect(repository.emptyTrash).toHaveBeenCalledTimes(1);

    expect(ui.success).toHaveBeenCalledWith('✔ Trash emptied successfully.');
  });

  test('should lock a note successfully', () => {
    const note = {
      id: 1,
      text: 'Learn Express',
      is_locked: false,
    };

    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, note);
    });

    repository.lockNote.mockImplementation((id, callback) => {
      callback(null);
    });

    service.lockNote(1);

    expect(repository.lockNote).toHaveBeenCalledWith(1, expect.any(Function));

    expect(ui.success).toHaveBeenCalledWith('✔ Locked: Learn Express');
  });

  test('should unlock a note successfully', () => {
    const note = {
      id: 1,
      text: 'Learn Express',
      is_locked: true,
    };

    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, note);
    });

    repository.unlockNote.mockImplementation((id, callback) => {
      callback(null);
    });

    service.unlockNote(1);

    expect(repository.unlockNote).toHaveBeenCalledWith(1, expect.any(Function));

    expect(ui.success).toHaveBeenCalledWith('✔ Unlocked: Learn Express');
  });

  test('should pin a note successfully', () => {
    const note = {
      id: 1,
      text: 'Learn Express',
      is_pinned: false,
    };

    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, note);
    });

    repository.pinNote.mockImplementation((id, callback) => {
      callback(null);
    });

    service.pinNote(1);

    expect(repository.pinNote).toHaveBeenCalledWith(1, expect.any(Function));

    expect(ui.success).toHaveBeenCalledWith('✔ Pinned: Learn Express');
  });

  test('should unpin a note successfully', () => {
    const note = {
      id: 1,
      text: 'Learn Express',
      is_pinned: true,
    };

    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, note);
    });

    repository.unpinNote.mockImplementation((id, callback) => {
      callback(null);
    });

    service.unpinNote(1);

    expect(repository.unpinNote).toHaveBeenCalledWith(1, expect.any(Function));

    expect(ui.success).toHaveBeenCalledWith('✔ Unpinned: Learn Express');
  });

  test('should reject pinning an already pinned note', () => {
    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, {
        id: 1,
        text: 'Learn Express',
        is_pinned: true,
      });
    });

    service.pinNote(1);

    expect(repository.pinNote).not.toHaveBeenCalled();

    expect(ui.warning).toHaveBeenCalledWith('⚠ Note is already pinned.');
  });

  test('should reject unpinning an unpinned note', () => {
    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, {
        id: 1,
        text: 'Learn Express',
        is_pinned: false,
      });
    });

    service.unpinNote(1);

    expect(repository.unpinNote).not.toHaveBeenCalled();

    expect(ui.warning).toHaveBeenCalledWith('⚠ Note is not pinned.');
  });

  test('should reject locking an already locked note', () => {
    const note = {
      id: 1,
      text: 'Learn Express',
      is_locked: true,
    };

    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, note);
    });

    service.lockNote(1);

    expect(repository.lockNote).not.toHaveBeenCalled();

    expect(ui.warning).toHaveBeenCalledWith('⚠ Note is already locked.');
  });

  test('should reject unlocking an unlocked note', () => {
    const note = {
      id: 1,
      text: 'Learn Express',
      is_locked: false,
    };

    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, note);
    });

    service.unlockNote(1);

    expect(repository.unlockNote).not.toHaveBeenCalled();

    expect(ui.warning).toHaveBeenCalledWith('⚠ Note is not locked.');
  });

  test('should reject updating a locked note', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, [
        {
          id: 1,
          text: 'Learn Express',
          is_locked: true,
        },
      ]);
    });

    service.updateNote(1, 'New Text');

    expect(repository.updateNote).not.toHaveBeenCalled();

    expect(ui.warning).toHaveBeenCalledWith('⚠ Note is locked.');
  });

  test('should reject deleting a locked note', () => {
    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, {
        id: 1,
        text: 'Learn Express',
        is_locked: true,
      });
    });

    service.deleteNote(1);

    expect(repository.moveToTrash).not.toHaveBeenCalled();

    expect(ui.warning).toHaveBeenCalledWith('⚠ Note is locked.');
  });

  test('should reject archiving a locked note', () => {
    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, {
        id: 1,
        text: 'Learn Express',
        archived: false,
        is_locked: true,
      });
    });

    service.archiveNote(1);

    expect(repository.archiveNote).not.toHaveBeenCalled();

    expect(ui.warning).toHaveBeenCalledWith('⚠ Note is locked.');
  });

  test('should reject completing a locked note', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, [
        {
          id: 1,
          text: 'Learn Express',
          completed: false,
          is_locked: true,
        },
      ]);
    });

    service.completeNote(1);

    expect(repository.updateNote).not.toHaveBeenCalled();

    expect(ui.warning).toHaveBeenCalledWith('⚠ Note is locked.');
  });

  test('should reject uncompleting a locked note', () => {
    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, {
        id: 1,
        text: 'Learn Express',
        completed: true,
        is_locked: true,
      });
    });

    service.uncompleteNote(1);

    expect(repository.updateNote).not.toHaveBeenCalled();

    expect(ui.warning).toHaveBeenCalledWith('⚠ Note is locked.');
  });

  test('should delete a category successfully', () => {
    repository.getCategories.mockImplementation((callback) => {
      callback(null, [
        {
          category: 'Work',
        },
      ]);
    });

    repository.deleteCategory.mockImplementation((category, callback) => {
      callback(null);
    });

    service.deleteCategory('Work');

    expect(repository.getCategories).toHaveBeenCalledTimes(1);

    expect(repository.deleteCategory).toHaveBeenCalledWith(
      'Work',
      expect.any(Function)
    );

    expect(ui.success).toHaveBeenCalledWith(
      '✔ Category deleted. Notes moved to General.'
    );
  });

  test('should change a note category successfully', () => {
    const note = {
      id: 1,
      text: 'Learn Express',
      category: 'General',
    };

    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, note);
    });

    repository.setCategory.mockImplementation((id, category, callback) => {
      callback(null);
    });

    service.setCategory(1, 'Programming');

    expect(repository.getNoteById).toHaveBeenCalledTimes(1);

    expect(repository.setCategory).toHaveBeenCalledWith(
      1,
      'Programming',
      expect.any(Function)
    );

    expect(ui.success).toHaveBeenCalledWith(
      '✔ Category changed to: Programming'
    );
  });

  test('should rename a category successfully', () => {
    repository.getCategories.mockImplementation((callback) => {
      callback(null, [
        {
          category: 'Programming',
        },
      ]);
    });

    repository.renameCategory.mockImplementation(
      (oldCategory, newCategory, callback) => {
        callback(null);
      }
    );

    service.renameCategory('Programming', 'Coding');

    expect(repository.renameCategory).toHaveBeenCalledWith(
      'Programming',
      'Coding',
      expect.any(Function)
    );

    expect(ui.success).toHaveBeenCalledWith('✔ Category renamed to: Coding');
  });

  test('should reject renaming a missing category', () => {
    repository.getCategories.mockImplementation((callback) => {
      callback(null, []);
    });

    service.renameCategory('Programming', 'Coding');

    expect(repository.renameCategory).not.toHaveBeenCalled();

    expect(ui.warning).toHaveBeenCalledWith('⚠ Category not found.');
  });

  test('should favorite a note successfully', () => {
    const note = {
      id: 1,
      text: 'Learn Express',
      is_favorite: false,
    };

    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, note);
    });

    repository.favoriteNote.mockImplementation((id, callback) => {
      callback(null);
    });

    service.favoriteNote(1);

    expect(repository.favoriteNote).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );

    expect(ui.success).toHaveBeenCalledWith(
      '✔ Added to favorites: Learn Express'
    );
  });

  test('should reject favoriting an already favorite note', () => {
    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, {
        id: 1,
        text: 'Learn Express',
        is_favorite: true,
      });
    });

    service.favoriteNote(1);

    expect(repository.favoriteNote).not.toHaveBeenCalled();

    expect(ui.warning).toHaveBeenCalledWith('⚠ Note is already in favorites.');
  });

  test('should reject favoriting an invalid note ID', () => {
    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, null);
    });

    service.favoriteNote(1);

    expect(repository.favoriteNote).not.toHaveBeenCalled();

    expect(ui.error).toHaveBeenCalledWith('✖ Invalid note ID.');
  });

  test('should unfavorite a note successfully', () => {
    const note = {
      id: 1,
      text: 'Learn Express',
      is_favorite: true,
    };

    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, note);
    });

    repository.unfavoriteNote.mockImplementation((id, callback) => {
      callback(null);
    });

    service.unfavoriteNote(1);

    expect(repository.unfavoriteNote).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );

    expect(ui.success).toHaveBeenCalledWith(
      '✔ Removed from favorites: Learn Express'
    );
  });

  test('should reject unfavoriting a non-favorite note', () => {
    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, {
        id: 1,
        text: 'Learn Express',
        is_favorite: false,
      });
    });

    service.unfavoriteNote(1);

    expect(repository.unfavoriteNote).not.toHaveBeenCalled();

    expect(ui.warning).toHaveBeenCalledWith('⚠ Note is not in favorites.');
  });

  test('should reject unfavoriting an invalid note ID', () => {
    repository.getNoteById.mockImplementation((id, callback) => {
      callback(null, null);
    });

    service.unfavoriteNote(1);

    expect(repository.unfavoriteNote).not.toHaveBeenCalled();

    expect(ui.error).toHaveBeenCalledWith('✖ Invalid note ID.');
  });

  test('doctor should report healthy database', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, [
        {
          id: 1,
          priority: 'medium',
          recurrence: null,
        },
      ]);
    });

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    service.runDoctor();

    expect(repository.getAllNotes).toHaveBeenCalledTimes(1);

    logSpy.mockRestore();
  });

  test('doctor should handle database error', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(new Error('DB Error'));
    });

    service.runDoctor();

    expect(ui.error).toHaveBeenCalledWith('✖ Database connection failed.');
  });

  test('doctor should detect duplicate IDs', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, [
        { id: 1, priority: 'medium', recurrence: null },
        { id: 1, priority: 'high', recurrence: null },
      ]);
    });

    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

    service.runDoctor();

    expect(repository.getAllNotes).toHaveBeenCalledTimes(1);

    spy.mockRestore();
  });

  test('doctor should detect invalid priorities', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, [
        {
          id: 1,
          priority: 'super-high',
          recurrence: null,
        },
      ]);
    });

    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

    service.runDoctor();

    expect(repository.getAllNotes).toHaveBeenCalledTimes(1);

    spy.mockRestore();
  });

  test('doctor should detect invalid recurrence', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, [
        {
          id: 1,
          priority: 'medium',
          recurrence: 'yearly',
        },
      ]);
    });

    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

    service.runDoctor();

    expect(repository.getAllNotes).toHaveBeenCalledTimes(1);

    spy.mockRestore();
  });

  test('should show warning when no favorite notes exist', () => {
    repository.getFavoriteNotes.mockImplementation((callback) => {
      callback(null, []);
    });

    service.listFavoriteNotes();

    expect(ui.warning).toHaveBeenCalledWith('No favorite notes.');
  });

  test('should list favorite notes', () => {
    const notes = [
      {
        id: 1,
        text: 'Learn Express',
        is_favorite: true,
      },
    ];

    repository.getFavoriteNotes.mockImplementation((callback) => {
      callback(null, notes);
    });

    service.listFavoriteNotes();

    expect(printNotes).toHaveBeenCalledWith(notes);
  });

  test('should list recent notes', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, [
        {
          id: 1,
          text: 'A',
          createdAt: new Date().toISOString(),
        },
      ]);
    });

    service.listRecentNotes();

    expect(printNotes).toHaveBeenCalled();
  });

  test('should show warning when categories are empty', () => {
    repository.getCategories.mockImplementation((callback) => {
      callback(null, []);
    });

    service.listCategories();

    expect(ui.warning).toHaveBeenCalledWith('No categories found.');
  });

  test('should list categories', () => {
    repository.getCategories.mockImplementation((callback) => {
      callback(null, [
        {
          category: 'Work',
          count: 5,
        },
      ]);
    });

    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

    service.listCategories();

    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  test('should show warning when there are no favorite notes', () => {
    repository.getFavoriteNotes.mockImplementation((callback) => {
      callback(null, []);
    });

    service.listFavoriteNotes();

    expect(ui.warning).toHaveBeenCalledWith('No favorite notes.');
  });

  test('should show warning when no recent notes exist', () => {
    repository.getAllNotes.mockImplementation((callback) => {
      callback(null, []);
    });

    service.listRecentNotes();

    expect(ui.warning).toHaveBeenCalledWith('No notes found.');
  });
});
