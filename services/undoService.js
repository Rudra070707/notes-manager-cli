const ui = require('../ui/colors');
const logger = require('./loggerService');

const { getLastUndo, deleteLastUndo } = require('../database/undoRepository');

const {
  addNoteDirect,
  updateNote: updateNoteInDB,
  archiveNote: archiveNoteInDB,
  restoreArchivedNote: restoreArchivedNoteInDB,
  deleteNote: deleteNoteFromDB,
} = require('../database/noteRepository');

function removeUndoHistory(noteText, successMessage) {
  deleteLastUndo((error) => {
    if (error) {
      ui.warning('⚠ Undo completed, but history could not be updated.');
      return;
    }

    ui.success(`✔ Undo successful: ${successMessage}${noteText}"`);
  });
}

function performUndo(operation, note) {
  const actions = {
    add: {
      execute: (callback) => deleteNoteFromDB(note.id, callback),
      error: '✖ Failed to undo operation.',
      success: 'removed "',
    },

    update: {
      execute: (callback) => updateNoteInDB(note, callback),
      error: '✖ Failed to restore previous version.',
      success: 'restored "',
    },

    archive: {
      execute: (callback) => restoreArchivedNoteInDB(note.id, callback),
      error: '✖ Failed to restore archived note.',
      success: 'restored "',
    },

    restore: {
      execute: (callback) => archiveNoteInDB(note.id, callback),
      error: '✖ Failed to archive restored note.',
      success: 'archived "',
    },

    delete: {
      execute: (callback) => addNoteDirect(note, callback),
      error: '✖ Failed to restore deleted note.',
      success: 'restored "',
    },

    complete: {
      execute: (callback) => updateNoteInDB(note, callback),
      error: '✖ Failed to undo completed note.',
      success: 'marked "',
      suffix: '" as pending',
    },
  };

  const action = actions[operation];

  if (!action) {
    ui.warning('⚠ Undo for this operation is not implemented yet.');
    return;
  }

  action.execute((error) => {
    if (error) {
      ui.error(action.error);
      return;
    }

    if (action.suffix) {
      deleteLastUndo((deleteError) => {
        if (deleteError) {
          ui.warning('⚠ Undo completed, but history could not be updated.');
          return;
        }

        ui.success(
          `✔ Undo successful: ${action.success}${note.text}${action.suffix}`
        );
      });

      return;
    }

    removeUndoHistory(note.text, action.success);
  });
}

function undoLastOperation() {
  getLastUndo((error, undo) => {
    if (error) {
      ui.error('✖ Failed to load undo history.');
      return;
    }

    if (!undo) {
      ui.warning('⚠ Nothing to undo.');
      return;
    }

    const note = undo.payload.note;

    logger.log('UNDO', undo.operation);

    performUndo(undo.operation, note);
  });
}

module.exports = {
  undoLastOperation,
};
