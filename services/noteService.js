const { filterNotes } = require('../filters/noteFilter');
const { sortNotes } = require('../sorters/noteSorter');
const { validatePriority } = require('../validators/priorityValidator');
const { validateTag } = require('../validators/tagValidator');
const { validateDueDate } = require('../validators/dueDateValidator');
const { validateRecurrence } = require('../validators/recurrenceValidator');
const {
  getAllNotes,
  getArchivedNotes,
  getTrashedNotes,
  getNoteById,
  addNote: addNoteToDB,
  addNoteDirect,
  updateNote: updateNoteInDB,
  archiveNote: archiveNoteInDB,
  restoreArchivedNote: restoreArchivedNoteInDB,
  clearArchivedNotes: clearArchivedNotesFromDB,
  moveToTrash,
  restoreFromTrash,
  emptyTrash,
  lockNote: lockNoteInDB,
  unlockNote: unlockNoteInDB,
  pinNote: pinNoteInDB,
  unpinNote: unpinNoteInDB,
  deleteNote: deleteNoteFromDB,
  clearNotes: clearNotesFromDB,
} = require('../database/noteRepository');
const ui = require('../ui/colors');
const { printNotes } = require('../ui/table');
const { validateText } = require('../validators/textValidator');
const { saveUndo } = require('../database/undoRepository');
const logger = require('./loggerService');
function addNote(
  text,
  priority = 'medium',
  tag = '',
  dueDate = null,
  recurrence = null
) {
  if (!validateText(text)) {
    ui.error('✖ Please provide a note.');
    ui.info('Example: notes add "Learn Express"');
    return;
  }

  const validatedPriority = validatePriority(priority);

  if (!validatedPriority) {
    ui.error('✖ Invalid priority.');
    ui.info('Allowed values: low, medium, high');
    return;
  }

  const tags = validateTag(tag);

  const validatedDueDate = validateDueDate(dueDate);

  if (dueDate && !validatedDueDate) {
    ui.error('✖ Invalid due date.');
    ui.info('Use format: YYYY-MM-DD');
    return;
  }

  const validatedRecurrence = validateRecurrence(recurrence);

  if (recurrence && !validatedRecurrence) {
    ui.error('✖ Invalid recurrence.');
    ui.info('Allowed values: daily, weekly, monthly');
    return;
  }

  getAllNotes((err, notes) => {
    if (err) {
      ui.error('✖ Failed to load notes.');
      return;
    }

    const exists = notes.some(
      (note) => note.text.toLowerCase() === text.trim().toLowerCase()
    );

    if (exists) {
      ui.warning('⚠ Note already exists.');
      return;
    }

    const nextId =
      notes.length === 0 ? 1 : Math.max(...notes.map((note) => note.id)) + 1;

    const newNote = {
      id: nextId,
      text: text.trim(),
      priority: validatedPriority,
      tags,
      dueDate: validatedDueDate,
      recurrence: validatedRecurrence,
      completed: false,
      archived: false,
      is_trashed: false,
      is_locked: false,
      is_pinned: false,
      createdAt: new Date().toISOString(),
    };

    addNoteToDB(newNote, (err) => {
      if (err) {
        ui.error('✖ Failed to add note.');
        return;
      }

      saveUndo(
        'add',
        {
          note: newNote,
        },
        (undoErr) => {
          if (undoErr) {
            ui.warning('⚠ Undo history could not be saved.');
          }

          logger.log('ADD', newNote.text);

          ui.success('✔ Note added successfully!');
        }
      );
    });
  });
}

function listNotes(options = {}) {
  getAllNotes((err, notes) => {
    if (err) {
      ui.error('✖ Failed to load notes.');
      return;
    }

    const filtered = filterNotes(notes, options);
    const sorted = sortNotes(filtered, options.sort);

    ui.heading('\nNotes');
    ui.divider();

    if (sorted.length === 0) {
      ui.warning('No notes found.');
      return;
    }

    printNotes(sorted);
  });
}

function deleteNote(id) {
  getNoteById(Number(id), (err, note) => {
    if (err) {
      ui.error('✖ Failed to load notes.');
      return;
    }

    if (!note) {
      ui.error('✖ Invalid note ID.');
      return;
    }

    if (note.is_trashed) {
      ui.warning('⚠ Note is already in Trash.');
      return;
    }
    if (note.is_locked) {
      ui.warning('⚠ Note is locked.');
      return;
    }
    moveToTrash(Number(id), (err) => {
      if (err) {
        ui.error('✖ Failed to move note to Trash.');
        return;
      }

      saveUndo(
        'trash',
        {
          note,
        },
        (undoErr) => {
          if (undoErr) {
            ui.warning('⚠ Undo history could not be saved.');
          }

          logger.log('TRASH', note.text);

          ui.success(`✔ Moved to Trash: ${note.text}`);
        }
      );
    });
  });
}

function updateNote(id, newText) {
  if (!validateText(newText)) {
    ui.error('✖ Please provide the updated note.');
    return;
  }

  getAllNotes((err, notes) => {
    if (err) {
      ui.error('✖ Failed to load notes.');
      return;
    }

    const note = notes.find((note) => note.id === Number(id));

    if (!note) {
      ui.error('✖ Invalid note ID.');
      return;
    }
    if (note.is_locked) {
      ui.warning('⚠ Note is locked.');
      return;
    }
    const exists = notes.some(
      (n) =>
        n.id !== note.id &&
        n.text.toLowerCase() === newText.trim().toLowerCase()
    );

    if (exists) {
      ui.warning('⚠ Note already exists.');
      return;
    }

    const oldText = note.text;
    const oldNote = { ...note };

    note.text = newText.trim();

    updateNoteInDB(note, (err) => {
      if (err) {
        ui.error('✖ Failed to update note.');
        return;
      }

      saveUndo(
        'update',
        {
          oldNote,
          newNote: note,
        },
        (undoErr) => {
          if (undoErr) {
            ui.warning('⚠ Undo history could not be saved.');
          }
          logger.log('UPDATE', `${oldNote.text} -> ${note.text}`);
          ui.success('✔ Note updated successfully!');
          console.log(`"${oldText}"`);
          console.log(`→ "${note.text}"`);
        }
      );
    });
  });
}

function completeNote(id) {
  getAllNotes((err, notes) => {
    if (err) {
      ui.error('✖ Failed to load notes.');
      return;
    }

    const note = notes.find((note) => note.id === Number(id));

    if (!note) {
      ui.error('✖ Invalid note ID.');
      return;
    }
    const oldNote = { ...note };
    if (note.is_locked) {
      ui.warning('⚠ Note is locked.');
      return;
    }
    if (note.completed) {
      ui.warning('⚠ Note is already completed.');
      return;
    }

    note.completed = true;

    updateNoteInDB(note, (err) => {
      if (err) {
        ui.error('✖ Failed to complete note.');
        return;
      }

      if (!note.recurrence) {
        saveUndo(
          'complete',
          {
            note: oldNote,
          },
          (undoErr) => {
            if (undoErr) {
              ui.warning('⚠ Undo history could not be saved.');
            }

            logger.log('COMPLETE', note.text);

            ui.success(`✔ Completed: ${note.text}`);
          }
        );

        return;
      }

      const nextId = Math.max(...notes.map((n) => n.id)) + 1;

      let nextDueDate = note.dueDate;

      if (note.dueDate) {
        const date = new Date(note.dueDate);

        switch (note.recurrence) {
          case 'daily':
            date.setDate(date.getDate() + 1);
            break;

          case 'weekly':
            date.setDate(date.getDate() + 7);
            break;

          case 'monthly':
            date.setMonth(date.getMonth() + 1);
            break;
        }

        nextDueDate = date.toISOString().split('T')[0];
      }

      addNoteToDB(
        {
          id: nextId,
          text: note.text,
          priority: note.priority,
          tags: [...note.tags],
          dueDate: nextDueDate,
          recurrence: note.recurrence,
          completed: false,
          archived: false,
          is_trashed: false,
          is_locked: false,
          is_pinned: false,
          createdAt: new Date().toISOString(),
        },
        (err) => {
          if (err) {
            ui.error('✖ Failed to create recurring note.');
            return;
          }

          saveUndo(
            'complete',
            {
              note: oldNote,
            },
            (undoErr) => {
              if (undoErr) {
                ui.warning('⚠ Undo history could not be saved.');
              }
              logger.log('COMPLETE', note.text);
              ui.success(`✔ Completed: ${note.text}`);
            }
          );
        }
      );
    });
  });
}

function uncompleteNote(id) {
  getNoteById(Number(id), (err, note) => {
    if (err) {
      ui.error('✖ Failed to load note.');
      return;
    }

    if (!note) {
      ui.error('✖ Invalid note ID.');
      return;
    }
    if (note.is_locked) {
      ui.warning('⚠ Note is locked.');
      return;
    }
    note.completed = false;

    updateNoteInDB(note, (err) => {
      if (err) {
        ui.error('✖ Failed to update note.');
        return;
      }
      logger.log('UNCOMPLETE', note.text);
      ui.success(`✔ Marked as pending: ${note.text}`);
    });
  });
}

function clearNotes() {
  clearNotesFromDB((err) => {
    if (err) {
      ui.error('✖ Failed to clear notes.');
      return;
    }

    ui.success('✔ All notes have been deleted.');
  });
}

function searchNotes(keyword) {
  if (!keyword) {
    ui.error('✖ Please provide a keyword.');
    return;
  }

  getAllNotes((err, notes) => {
    if (err) {
      ui.error('✖ Failed to load notes.');
      return;
    }

    const results = notes.filter((note) =>
      note.text.toLowerCase().includes(keyword.toLowerCase())
    );

    ui.heading('\nSearch Results');
    ui.divider();

    if (results.length === 0) {
      ui.warning('No matching notes found.');
      return;
    }

    printNotes(results);
  });
}

function showStats() {
  getAllNotes((err, notes) => {
    if (err) {
      ui.error('✖ Failed to load notes.');
      return;
    }

    const total = notes.length;
    const completed = notes.filter((note) => note.completed).length;
    const pending = total - completed;

    const completionRate =
      total === 0 ? 0 : ((completed / total) * 100).toFixed(2);

    ui.heading('\nNotes Statistics');
    ui.divider();

    console.log(`Total Notes     : ${total}`);
    console.log(`Completed Notes : ${completed}`);
    console.log(`Pending Notes   : ${pending}`);
    console.log(`Completion Rate : ${completionRate}%`);
  });
}

function archiveNote(id) {
  getNoteById(Number(id), (err, note) => {
    if (err) {
      ui.error('✖ Failed to load note.');
      return;
    }

    if (!note) {
      ui.error('✖ Invalid note ID.');
      return;
    }

    if (note.archived) {
      ui.warning('⚠ Note is already archived.');
      return;
    }
    if (note.is_locked) {
      ui.warning('⚠ Note is locked.');
      return;
    }
    archiveNoteInDB(Number(id), (err) => {
      if (err) {
        ui.error('✖ Failed to archive note.');
        return;
      }

      saveUndo(
        'archive',
        {
          note,
        },
        (undoErr) => {
          if (undoErr) {
            ui.warning('⚠ Undo history could not be saved.');
          }

          logger.log('ARCHIVE', note.text);

          ui.success(`✔ Archived: ${note.text}`);
        }
      );
    });
  });
}

function listArchivedNotes() {
  getArchivedNotes((err, notes) => {
    if (err) {
      ui.error('✖ Failed to load archived notes.');
      return;
    }

    ui.heading('\nArchived Notes');
    ui.divider();

    if (notes.length === 0) {
      ui.warning('No archived notes.');
      return;
    }

    printNotes(notes);
  });
}

function listTrashedNotes() {
  getTrashedNotes((err, notes) => {
    if (err) {
      ui.error('✖ Failed to load Trash.');
      return;
    }

    ui.heading('\nTrash');
    ui.divider();

    if (notes.length === 0) {
      ui.warning('Trash is empty.');
      return;
    }

    printNotes(notes);
  });
}
function restoreTrashedNote(id) {
  getNoteById(Number(id), (err, note) => {
    if (err) {
      ui.error('✖ Failed to load note.');
      return;
    }

    if (!note) {
      ui.error('✖ Invalid note ID.');
      return;
    }

    if (!note.is_trashed) {
      ui.warning('⚠ Note is not in Trash.');
      return;
    }

    restoreFromTrash(Number(id), (err) => {
      if (err) {
        ui.error('✖ Failed to restore note.');
        return;
      }

      saveUndo(
        'restore-trash',
        {
          note,
        },
        (undoErr) => {
          if (undoErr) {
            ui.warning('⚠ Undo history could not be saved.');
          }

          logger.log('RESTORE_TRASH', note.text);

          ui.success(`✔ Restored from Trash: ${note.text}`);
        }
      );
    });
  });
}
function emptyTrashBin() {
  emptyTrash((err) => {
    if (err) {
      ui.error('✖ Failed to empty Trash.');
      return;
    }

    logger.log('EMPTY_TRASH', 'All trashed notes');

    ui.success('✔ Trash emptied successfully.');
  });
}
function restoreArchivedNote(id) {
  getNoteById(Number(id), (err, note) => {
    if (err) {
      ui.error('✖ Failed to load note.');
      return;
    }

    if (!note) {
      ui.error('✖ Invalid note ID.');
      return;
    }

    if (!note.archived) {
      ui.warning('⚠ Note is not archived.');
      return;
    }

    restoreArchivedNoteInDB(Number(id), (err) => {
      if (err) {
        ui.error('✖ Failed to restore note.');
        return;
      }

      saveUndo(
        'restore',
        {
          note,
        },
        (undoErr) => {
          if (undoErr) {
            ui.warning('⚠ Undo history could not be saved.');
          }

          logger.log('RESTORE', note.text);

          ui.success(`✔ Restored: ${note.text}`);
        }
      );
    });
  });
}

function clearArchivedNotes() {
  clearArchivedNotesFromDB((err) => {
    if (err) {
      ui.error('✖ Failed to clear archived notes.');
      return;
    }

    ui.success('✔ Archived notes cleared.');
  });
}
function lockNote(id) {
  getNoteById(Number(id), (err, note) => {
    if (err) {
      ui.error('✖ Failed to load note.');
      return;
    }

    if (!note) {
      ui.error('✖ Invalid note ID.');
      return;
    }

    if (note.is_locked) {
      ui.warning('⚠ Note is already locked.');
      return;
    }

    lockNoteInDB(Number(id), (err) => {
      if (err) {
        ui.error('✖ Failed to lock note.');
        return;
      }

      saveUndo(
        'lock',
        {
          note,
        },
        (undoErr) => {
          if (undoErr) {
            ui.warning('⚠ Undo history could not be saved.');
          }

          logger.log('LOCK', note.text);

          ui.success(`✔ Locked: ${note.text}`);
        }
      );
    });
  });
}
function unlockNote(id) {
  getNoteById(Number(id), (err, note) => {
    if (err) {
      ui.error('✖ Failed to load note.');
      return;
    }

    if (!note) {
      ui.error('✖ Invalid note ID.');
      return;
    }

    if (!note.is_locked) {
      ui.warning('⚠ Note is not locked.');
      return;
    }

    unlockNoteInDB(Number(id), (err) => {
      if (err) {
        ui.error('✖ Failed to unlock note.');
        return;
      }

      saveUndo(
        'unlock',
        {
          note,
        },
        (undoErr) => {
          if (undoErr) {
            ui.warning('⚠ Undo history could not be saved.');
          }

          logger.log('UNLOCK', note.text);

          ui.success(`✔ Unlocked: ${note.text}`);
        }
      );
    });
  });
}
function pinNote(id) {
  getNoteById(Number(id), (err, note) => {
    if (err) {
      ui.error('✖ Failed to load note.');
      return;
    }

    if (!note) {
      ui.error('✖ Invalid note ID.');
      return;
    }

    if (note.is_pinned) {
      ui.warning('⚠ Note is already pinned.');
      return;
    }

    pinNoteInDB(Number(id), (err) => {
      if (err) {
        ui.error('✖ Failed to pin note.');
        return;
      }

      saveUndo(
        'pin',
        {
          note,
        },
        (undoErr) => {
          if (undoErr) {
            ui.warning('⚠ Undo history could not be saved.');
          }

          logger.log('PIN', note.text);

          ui.success(`✔ Pinned: ${note.text}`);
        }
      );
    });
  });
}
function unpinNote(id) {
  getNoteById(Number(id), (err, note) => {
    if (err) {
      ui.error('✖ Failed to load note.');
      return;
    }

    if (!note) {
      ui.error('✖ Invalid note ID.');
      return;
    }

    if (!note.is_pinned) {
      ui.warning('⚠ Note is not pinned.');
      return;
    }

    unpinNoteInDB(Number(id), (err) => {
      if (err) {
        ui.error('✖ Failed to unpin note.');
        return;
      }

      saveUndo(
        'unpin',
        {
          note,
        },
        (undoErr) => {
          if (undoErr) {
            ui.warning('⚠ Undo history could not be saved.');
          }

          logger.log('UNPIN', note.text);

          ui.success(`✔ Unpinned: ${note.text}`);
        }
      );
    });
  });
}
module.exports = {
  addNote,
  listNotes,
  archiveNote,
  listArchivedNotes,
  listTrashedNotes,
  restoreTrashedNote,
  emptyTrashBin,
  restoreArchivedNote,
  clearArchivedNotes,
  lockNote,
  unlockNote,
  pinNote,
  unpinNote,
  deleteNote,
  updateNote,
  completeNote,
  uncompleteNote,
  clearNotes,
  searchNotes,
  showStats,
};
