const fs = require("fs");
const path = require("path");

const repository = require("../database/noteRepository");

const EXPORT_DIRECTORY = path.join(__dirname, "..", "exports");

function ensureExportDirectory() {
  if (!fs.existsSync(EXPORT_DIRECTORY)) {
    fs.mkdirSync(EXPORT_DIRECTORY, { recursive: true });
  }
}

function createTimestamp() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}_${hour}-${minute}-${second}`;
}

function exportJson(notes, filePath) {
  fs.writeFileSync(filePath, JSON.stringify(notes, null, 2), "utf8");
}

function exportCsv(notes, filePath) {
  const header = "id,text,priority,tags,dueDate,recurrence,completed,createdAt";

  const rows = notes.map((note) => {
    return [
      note.id,
      `"${String(note.text).replace(/"/g, '""')}"`,
      note.priority,
      `"${note.tags.join(";")}"`,
      note.dueDate || "",
      note.recurrence || "",
      note.completed,
      note.createdAt,
    ].join(",");
  });

  fs.writeFileSync(filePath, [header, ...rows].join("\n"), "utf8");
}

function exportMarkdown(notes, filePath) {
  let output = "# Notes\n\n";

  notes.forEach((note) => {
    output += `## ${note.text}\n`;
    output += `- ID: ${note.id}\n`;
    output += `- Priority: ${note.priority}\n`;
    output += `- Completed: ${note.completed}\n`;
    output += `- Due Date: ${note.dueDate || "-"}\n`;
    output += `- Recurrence: ${note.recurrence || "-"}\n`;
    output += `- Tags: ${note.tags.join(", ") || "-"}\n`;
    output += `- Created: ${note.createdAt}\n\n`;
  });

  fs.writeFileSync(filePath, output, "utf8");
}

function exportNotes(format) {
  ensureExportDirectory();

  repository.getAllNotes((err, notes) => {
    if (err) {
      console.error("Error:", err.message);
      return;
    }

    const timestamp = createTimestamp();

    let extension;
    let exporter;

    switch (format.toLowerCase()) {
      case "json":
        extension = "json";
        exporter = exportJson;
        break;

      case "csv":
        extension = "csv";
        exporter = exportCsv;
        break;

      case "md":
      case "markdown":
        extension = "md";
        exporter = exportMarkdown;
        break;

      default:
        console.log("Unsupported export format.");
        return;
    }

    const filename = `notes-${timestamp}.${extension}`;
    const filePath = path.join(EXPORT_DIRECTORY, filename);

    exporter(notes, filePath);

    console.log(`\n✔ Exported ${notes.length} notes`);
    console.log(filePath);
  });
}

module.exports = {
  exportNotes,
};
