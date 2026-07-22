const Table = require("cli-table3");

function printNotes(notes) {
  const table = new Table({
    head: ["ID", "Status", "Priority", "Tags", "Note"],
    colWidths: [6, 15, 12, 20, 35],
    wordWrap: true,
  });

  notes.forEach((note) => {
    table.push([
      note.id,
      note.completed ? "✓ Done" : "○ Pending",
      (note.priority || "medium").toUpperCase(),
      (note.tags || []).join(", "),
      note.text,
    ]);
  });

  console.log(table.toString());
}

module.exports = {
  printNotes,
};
