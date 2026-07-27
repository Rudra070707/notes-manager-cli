const { unpinNote } = require('../services/noteService');

module.exports = (id) => {
  unpinNote(id);
};
