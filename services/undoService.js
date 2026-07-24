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

function undoLastOperation() {
  getLastUndo((err, undo) => {
    if (err) {
      ui.error('✖ Failed to load undo history.');
      return;
    }

    if (!undo) {
      ui.warning('⚠ Nothing to undo.');
      return;
    }

    const note = undo.payload.note;
    logger.log('UNDO', undo.operation);

    if (undo.operation === 'add') {
      deleteNoteFromDB(note.id, (err) => {
        if (err) {
          ui.error('✖ Failed to undo operation.');
          return;
        }

        deleteLastUndo((err) => {
          if (err) {
            ui.warning('⚠ Undo completed, but history could not be updated.');
            return;
          }

          ui.success(`✔ Undo successful: removed "${note.text}"`);
        });
      });

      return;
    }

    if (undo.operation === 'update') {
      updateNoteInDB(note, (err) => {
        if (err) {
          ui.error('✖ Failed to restore previous version.');
          return;
        }

        deleteLastUndo((err) => {
          if (err) {
            ui.warning('⚠ Undo completed, but history could not be updated.');
            return;
          }

          ui.success(`✔ Undo successful: restored "${note.text}"`);
        });
      });

      return;
    }

    if (undo.operation === 'archive') {
      restoreArchivedNoteInDB(note.id, (err) => {
        if (err) {
          ui.error('✖ Failed to restore archived note.');
          return;
        }

        deleteLastUndo((err) => {
          if (err) {
            ui.warning('⚠ Undo completed, but history could not be updated.');
            return;
          }

          ui.success(`✔ Undo successful: restored "${note.text}"`);
        });
      });

      return;
    }

    if (undo.operation === 'restore') {
      archiveNoteInDB(note.id, (err) => {
        if (err) {
          ui.error('✖ Failed to archive restored note.');
          return;
        }

        deleteLastUndo((err) => {
          if (err) {
            ui.warning('⚠ Undo completed, but history could not be updated.');
            return;
          }

          ui.success(`✔ Undo successful: archived "${note.text}"`);
        });
      });

      return;
    }

    if (undo.operation === 'delete') {
      addNoteDirect(note, (err) => {
        if (err) {
          ui.error('✖ Failed to restore deleted note.');
          return;
        }

        deleteLastUndo((err) => {
          if (err) {
            ui.warning('⚠ Undo completed, but history could not be updated.');
            return;
          }

          ui.success(`✔ Undo successful: restored "${note.text}"`);
        });
      });

      return;
    }

    if (undo.operation === 'complete') {
      updateNoteInDB(note, (err) => {
        if (err) {
          ui.error('✖ Failed to undo completed note.');
          return;
        }

        deleteLastUndo((err) => {
          if (err) {
            ui.warning('⚠ Undo completed, but history could not be updated.');
            return;
          }

          ui.success(`✔ Undo successful: marked "${note.text}" as pending`);
        });
      });

      return;
    }

    ui.warning('⚠ Undo for this operation is not implemented yet.');
  });
}

module.exports = {
  undoLastOperation,
};
