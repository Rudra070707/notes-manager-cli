const { confirm } = require("../helpers/confirm");
const { clearNotes } = require("../services/noteService");
const ui = require("../ui/colors");

module.exports = async function () {
  const approved = await confirm("Are you sure you want to delete ALL notes?");

  if (!approved) {
    ui.warning("Operation cancelled.");
    return;
  }

  clearNotes();
};
