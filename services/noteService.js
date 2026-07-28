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
  getFavoriteNotes,
  getNoteById,
  addNote: addNoteToDB,
  addNoteDirect,
  updateNote: updateNoteInDB,
  setCategory: setCategoryInDB,
  renameCategory: renameCategoryInDB,
  deleteCategory: deleteCategoryInDB,
  getCategories,
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
  favoriteNote: favoriteNoteInDB,
  unfavoriteNote: unfavoriteNoteInDB,
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
  recurrence = null,
  category = 'General'
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
      is_favorite: false,
      category: category?.trim() || 'General',
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
  if (options.favorite) {
    listFavoriteNotes();
    return;
  }

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
          is_favorite: false,
          category: note.category || 'General',
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

function searchNotes(keyword = '', options = {}) {
  if (!keyword || !keyword.trim()) {
    ui.error('✖ Please provide a keyword.');
    return;
  }
  getAllNotes((err, notes) => {
    if (err) {
      ui.error('✖ Failed to load notes.');
      return;
    }

    let results = [...notes];

    if (keyword && keyword.trim()) {
      const searchText = keyword.trim().toLowerCase();

      results = results.filter((note) =>
        note.text.toLowerCase().includes(searchText)
      );
    }

    results = filterNotes(results, options);

    results = sortNotes(results);

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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const total = notes.length;

    const completed = notes.filter((note) => note.completed).length;

    const pending = total - completed;

    const favorites = notes.filter((note) => note.is_favorite).length;

    const pinned = notes.filter((note) => note.is_pinned).length;

    const locked = notes.filter((note) => note.is_locked).length;

    const archived = notes.filter((note) => note.archived).length;

    const trashed = notes.filter((note) => note.is_trashed).length;

    const highPriority = notes.filter(
      (note) => note.priority === 'high'
    ).length;

    const mediumPriority = notes.filter(
      (note) => note.priority === 'medium'
    ).length;

    const lowPriority = notes.filter((note) => note.priority === 'low').length;

    let dueToday = 0;
    let overdue = 0;

    notes.forEach((note) => {
      if (!note.dueDate) return;

      const due = new Date(note.dueDate);
      due.setHours(0, 0, 0, 0);

      if (due.getTime() === today.getTime()) {
        dueToday++;
      }

      if (due < today && !note.completed) {
        overdue++;
      }
    });

    const completionRate =
      total === 0 ? '0.00' : ((completed / total) * 100).toFixed(2);

    ui.heading('\nNotes Dashboard');
    ui.divider();

    console.log();

    console.log(`📄 Total Notes            : ${total}`);

    console.log();

    console.log(`✅ Completed              : ${completed}`);
    console.log(`📝 Pending                : ${pending}`);

    console.log();

    console.log(`⭐ Favorite Notes         : ${favorites}`);
    console.log(`📌 Pinned Notes           : ${pinned}`);
    console.log(`🔒 Locked Notes           : ${locked}`);

    console.log();

    console.log(`📦 Archived Notes         : ${archived}`);
    console.log(`🗑 Trashed Notes          : ${trashed}`);

    console.log();

    console.log(`🔴 High Priority          : ${highPriority}`);
    console.log(`🟡 Medium Priority        : ${mediumPriority}`);
    console.log(`🟢 Low Priority           : ${lowPriority}`);

    console.log();

    console.log(`📅 Due Today              : ${dueToday}`);
    console.log(`⚠ Overdue                : ${overdue}`);

    console.log();

    console.log(`📊 Completion Rate        : ${completionRate}%`);

    console.log();
  });
}
function listCategories() {
  getCategories((err, categories) => {
    if (err) {
      ui.error('✖ Failed to load categories.');
      return;
    }

    ui.heading('\nCategories');
    ui.divider();

    if (categories.length === 0) {
      ui.warning('No categories found.');
      return;
    }

    categories.forEach(({ category, count }) => {
      console.log(`${category || 'General'} (${count})`);
    });
  });
}
function renameCategory(oldCategory, newCategory) {
  if (!oldCategory || !oldCategory.trim()) {
    ui.error('✖ Please provide the current category.');
    return;
  }

  if (!newCategory || !newCategory.trim()) {
    ui.error('✖ Please provide the new category.');
    return;
  }

  if (oldCategory.trim().toLowerCase() === newCategory.trim().toLowerCase()) {
    ui.warning('⚠ Categories are the same.');
    return;
  }

  getCategories((err, categories) => {
    if (err) {
      ui.error('✖ Failed to load categories.');
      return;
    }

    const exists = categories.some(
      (c) =>
        c.category &&
        c.category.toLowerCase() === oldCategory.trim().toLowerCase()
    );

    if (!exists) {
      ui.warning('⚠ Category not found.');
      return;
    }

    renameCategoryInDB(oldCategory.trim(), newCategory.trim(), (err) => {
      if (err) {
        ui.error('✖ Failed to rename category.');
        return;
      }

      logger.log(
        'RENAME_CATEGORY',
        `${oldCategory.trim()} -> ${newCategory.trim()}`
      );

      ui.success(`✔ Category renamed to: ${newCategory.trim()}`);
    });
  });
}
function deleteCategory(category) {
  if (!category || !category.trim()) {
    ui.error('✖ Please provide a category.');
    return;
  }

  const normalizedCategory = category.trim();

  if (normalizedCategory.toLowerCase() === 'general') {
    ui.warning('⚠ The General category cannot be deleted.');
    return;
  }

  getCategories((err, categories) => {
    if (err) {
      ui.error('✖ Failed to load categories.');
      return;
    }

    const exists = categories.some(
      (c) =>
        c.category &&
        c.category.toLowerCase() === normalizedCategory.toLowerCase()
    );

    if (!exists) {
      ui.warning('⚠ Category not found.');
      return;
    }

    deleteCategoryInDB(normalizedCategory, (err) => {
      if (err) {
        ui.error('✖ Failed to delete category.');
        return;
      }

      logger.log('DELETE_CATEGORY', `${normalizedCategory} -> General`);

      ui.success(`✔ Category deleted. Notes moved to General.`);
    });
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
function listFavoriteNotes() {
  getFavoriteNotes((err, notes) => {
    if (err) {
      ui.error('✖ Failed to load favorite notes.');
      return;
    }

    ui.heading('\nFavorite Notes');
    ui.divider();

    if (notes.length === 0) {
      ui.warning('No favorite notes.');
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
function favoriteNote(id) {
  getNoteById(Number(id), (err, note) => {
    if (err) {
      ui.error('✖ Failed to load note.');
      return;
    }

    if (!note) {
      ui.error('✖ Invalid note ID.');
      return;
    }

    if (note.is_favorite) {
      ui.warning('⚠ Note is already in favorites.');
      return;
    }

    favoriteNoteInDB(Number(id), (err) => {
      if (err) {
        ui.error('✖ Failed to favorite note.');
        return;
      }

      saveUndo(
        'favorite',
        {
          note,
        },
        (undoErr) => {
          if (undoErr) {
            ui.warning('⚠ Undo history could not be saved.');
          }

          logger.log('FAVORITE', note.text);

          ui.success(`✔ Added to favorites: ${note.text}`);
        }
      );
    });
  });
}

function unfavoriteNote(id) {
  getNoteById(Number(id), (err, note) => {
    if (err) {
      ui.error('✖ Failed to load note.');
      return;
    }

    if (!note) {
      ui.error('✖ Invalid note ID.');
      return;
    }

    if (!note.is_favorite) {
      ui.warning('⚠ Note is not in favorites.');
      return;
    }

    unfavoriteNoteInDB(Number(id), (err) => {
      if (err) {
        ui.error('✖ Failed to remove favorite.');
        return;
      }

      saveUndo(
        'unfavorite',
        {
          note,
        },
        (undoErr) => {
          if (undoErr) {
            ui.warning('⚠ Undo history could not be saved.');
          }

          logger.log('UNFAVORITE', note.text);

          ui.success(`✔ Removed from favorites: ${note.text}`);
        }
      );
    });
  });
}
function setCategory(id, category) {
  if (!category || !category.trim()) {
    ui.error('✖ Please provide a category.');
    return;
  }

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

    const oldNote = { ...note };

    setCategoryInDB(Number(id), category.trim(), (err) => {
      if (err) {
        ui.error('✖ Failed to update category.');
        return;
      }

      note.category = category.trim();

      saveUndo(
        'category',
        {
          oldNote,
          newNote: note,
        },
        (undoErr) => {
          if (undoErr) {
            ui.warning('⚠ Undo history could not be saved.');
          }

          logger.log('CATEGORY', `${note.text} -> ${category.trim()}`);

          ui.success(`✔ Category changed to: ${category.trim()}`);
        }
      );
    });
  });
}
function runDoctor() {
  getAllNotes((err, notes) => {
    if (err) {
      ui.error('✖ Database connection failed.');
      return;
    }

    ui.heading('\nSystem Health Check');
    ui.divider();

    console.log('✔ Database connected');
    console.log('✔ Notes table accessible');

    const ids = notes.map((note) => note.id);
    const uniqueIds = new Set(ids);

    if (ids.length === uniqueIds.size) {
      console.log('✔ No duplicate IDs');
    } else {
      console.log('✖ Duplicate IDs detected');
    }

    const validPriorities = ['low', 'medium', 'high'];

    const invalidPriority = notes.some(
      (note) => !validPriorities.includes(note.priority)
    );

    if (invalidPriority) {
      console.log('✖ Invalid priority values found');
    } else {
      console.log('✔ All priorities valid');
    }

    const validRecurrence = [null, '', 'daily', 'weekly', 'monthly'];

    const invalidRecurrence = notes.some(
      (note) => !validRecurrence.includes(note.recurrence)
    );

    if (invalidRecurrence) {
      console.log('✖ Invalid recurrence values found');
    } else {
      console.log('✔ All recurrence values valid');
    }

    const invalidDueDate = notes.some((note) => {
      if (!note.dueDate) return false;

      return Number.isNaN(Date.parse(note.dueDate));
    });

    if (invalidDueDate) {
      console.log('✖ Invalid due dates found');
    } else {
      console.log('✔ All due dates valid');
    }

    console.log();

    if (
      ids.length === uniqueIds.size &&
      !invalidPriority &&
      !invalidRecurrence &&
      !invalidDueDate
    ) {
      ui.success('✔ Overall Status: Healthy');
    } else {
      ui.warning('⚠ Overall Status: Issues Found');
    }
  });
}
function listTodayNotes() {
  getAllNotes((err, notes) => {
    if (err) {
      ui.error('✖ Failed to load notes.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    const todayNotes = notes.filter(
      (note) =>
        note.dueDate === today &&
        !note.completed &&
        !note.archived &&
        !note.is_trashed
    );

    ui.heading("\nToday's Notes");
    ui.divider();

    if (todayNotes.length === 0) {
      ui.warning('No notes due today.');
      return;
    }

    printNotes(todayNotes);
  });
}
function listOverdueNotes() {
  getAllNotes((err, notes) => {
    if (err) {
      ui.error('✖ Failed to load notes.');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueNotes = notes.filter((note) => {
      if (!note.dueDate || note.completed || note.archived || note.is_trashed) {
        return false;
      }

      const due = new Date(note.dueDate);
      due.setHours(0, 0, 0, 0);

      return due < today;
    });

    ui.heading('\nOverdue Notes');
    ui.divider();

    if (overdueNotes.length === 0) {
      ui.warning('No overdue notes.');
      return;
    }

    printNotes(overdueNotes);
  });
}
function listUpcomingNotes() {
  getAllNotes((err, notes) => {
    if (err) {
      ui.error('✖ Failed to load notes.');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingNotes = notes.filter((note) => {
      if (!note.dueDate || note.completed || note.archived || note.is_trashed) {
        return false;
      }

      const due = new Date(note.dueDate);
      due.setHours(0, 0, 0, 0);

      return due > today && due <= nextWeek;
    });

    ui.heading('\nUpcoming Notes');
    ui.divider();

    if (upcomingNotes.length === 0) {
      ui.warning('No upcoming notes.');
      return;
    }

    printNotes(upcomingNotes);
  });
}
function listRecentNotes() {
  getAllNotes((err, notes) => {
    if (err) {
      ui.error('✖ Failed to load notes.');
      return;
    }

    const recentNotes = [...notes]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 10);

    ui.heading('\nRecent Notes');
    ui.divider();

    if (recentNotes.length === 0) {
      ui.warning('No notes found.');
      return;
    }

    printNotes(recentNotes);
  });
}
function showNextTask() {
  getAllNotes((err, notes) => {
    if (err) {
      ui.error('✖ Failed to load notes.');
      return;
    }

    const priorityOrder = {
      high: 1,
      medium: 2,
      low: 3,
    };

    const pending = notes.filter(
      (note) => !note.completed && !note.archived && !note.is_trashed
    );

    if (pending.length === 0) {
      ui.heading('\nNext Task');
      ui.divider();
      ui.warning('No pending tasks.');
      return;
    }

    pending.sort((a, b) => {
      const aHasDue = !!a.dueDate;
      const bHasDue = !!b.dueDate;

      if (aHasDue && bHasDue) {
        const dateDiff = new Date(a.dueDate) - new Date(b.dueDate);

        if (dateDiff !== 0) return dateDiff;
      } else if (aHasDue) {
        return -1;
      } else if (bHasDue) {
        return 1;
      }

      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    ui.heading('\nNext Task');
    ui.divider();

    printNotes([pending[0]]);
  });
}
function generateReport() {
  getAllNotes((err, notes) => {
    if (err) {
      ui.error('✖ Failed to load notes.');
      return;
    }

    const total = notes.length;

    const completed = notes.filter((n) => n.completed).length;
    const pending = total - completed;

    const favorites = notes.filter((n) => n.is_favorite).length;
    const pinned = notes.filter((n) => n.is_pinned).length;
    const locked = notes.filter((n) => n.is_locked).length;

    const archived = notes.filter((n) => n.archived).length;
    const trashed = notes.filter((n) => n.is_trashed).length;

    const completionRate =
      total === 0 ? '0.00' : ((completed / total) * 100).toFixed(2);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let dueToday = 0;
    let overdue = 0;

    notes.forEach((note) => {
      if (!note.dueDate) return;

      const due = new Date(note.dueDate);
      due.setHours(0, 0, 0, 0);

      if (due.getTime() === today.getTime()) {
        dueToday++;
      }

      if (due < today && !note.completed) {
        overdue++;
      }
    });

    const pendingNotes = notes.filter(
      (note) => !note.completed && !note.archived && !note.is_trashed
    );

    const priorityRank = {
      high: 1,
      medium: 2,
      low: 3,
    };

    pendingNotes.sort((a, b) => {
      return (
        (priorityRank[a.priority] || 99) - (priorityRank[b.priority] || 99)
      );
    });

    const topTask = pendingNotes[0];

    const categoryCount = {};

    notes.forEach((note) => {
      const category = note.category || 'General';

      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    let topCategory = null;

    Object.entries(categoryCount).forEach(([name, count]) => {
      if (!topCategory || count > topCategory.count) {
        topCategory = { name, count };
      }
    });

    const tagCount = {};

    notes.forEach((note) => {
      (note.tags || []).forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    let topTag = null;

    Object.entries(tagCount).forEach(([name, count]) => {
      if (!topTag || count > topTag.count) {
        topTag = { name, count };
      }
    });

    ui.heading('\n══════════════════════════════════════════════');
    ui.heading('          PRODUCTIVITY REPORT');
    ui.heading('══════════════════════════════════════════════');

    console.log();

    console.log(`📄 Total Notes         : ${total}`);
    console.log(`✅ Completed           : ${completed}`);
    console.log(`📝 Pending             : ${pending}`);

    console.log();

    console.log(`📊 Completion Rate     : ${completionRate}%`);

    console.log();

    console.log(`⭐ Favorites           : ${favorites}`);
    console.log(`📌 Pinned             : ${pinned}`);
    console.log(`🔒 Locked             : ${locked}`);

    console.log();

    console.log(`📦 Archived           : ${archived}`);
    console.log(`🗑 Trash              : ${trashed}`);

    console.log();

    console.log(`📅 Due Today          : ${dueToday}`);
    console.log(`⏰ Overdue            : ${overdue}`);

    console.log();

    console.log('🏆 Highest Priority Pending');
    console.log('--------------------------------------');
    console.log(topTask ? topTask.text : '-');

    console.log();

    console.log('📂 Most Used Category');
    console.log('--------------------------------------');

    if (topCategory) {
      console.log(`${topCategory.name} (${topCategory.count})`);
    } else {
      console.log('-');
    }

    console.log();

    console.log('🏷 Most Used Tag');
    console.log('--------------------------------------');

    if (topTag) {
      console.log(`${topTag.name} (${topTag.count})`);
    } else {
      console.log('-');
    }

    console.log();

    ui.heading('══════════════════════════════════════════════');
  });
}
module.exports = {
  addNote,
  listNotes,
  listCategories,
  renameCategory,
  deleteCategory,
  archiveNote,
  listArchivedNotes,
  listTrashedNotes,
  listFavoriteNotes,
  restoreTrashedNote,
  emptyTrashBin,
  restoreArchivedNote,
  clearArchivedNotes,
  lockNote,
  unlockNote,
  pinNote,
  unpinNote,
  favoriteNote,
  unfavoriteNote,
  setCategory,
  deleteNote,
  updateNote,
  completeNote,
  uncompleteNote,
  clearNotes,
  searchNotes,
  showStats,
  runDoctor,
  listTodayNotes,
  listOverdueNotes,
  listUpcomingNotes,
  listRecentNotes,
  showNextTask,
  generateReport,
};
