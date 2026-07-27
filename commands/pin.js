const { pinNote } = require('../services/noteService');

module.exports = (id) => {
  pinNote(id);
};
