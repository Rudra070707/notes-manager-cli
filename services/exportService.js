const fs = require('fs');
const path = require('path');

const repository = require('../database/noteRepository');

const EXPORT_DIRECTORY = path.join(__dirname, '..', 'exports');

function ensureExportDirectory() {
  if (!fs.existsSync(EXPORT_DIRECTORY)) {
    fs.mkdirSync(EXPORT_DIRECTORY, { recursive: true });
  }
}

function createTimestamp() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}_${hour}-${minute}-${second}`;
}

function getExporter(format) {
  switch (String(format).toLowerCase()) {
    case 'json':
      return {
        extension: 'json',
        exporter: exportJson,
      };

    case 'csv':
      return {
        extension: 'csv',
        exporter: exportCsv,
      };

    case 'md':
    case 'markdown':
      return {
        extension: 'md',
        exporter: exportMarkdown,
      };

    default:
      return null;
  }
}

function exportJson(notes, filePath) {
  ensureExportDirectory();

  fs.writeFileSync(filePath, JSON.stringify(notes, null, 2), 'utf8');
}

function exportCsv(notes, filePath) {
  ensureExportDirectory();

  const header = 'id,text,priority,tags,dueDate,recurrence,completed,createdAt';

  const rows = notes.map((note) =>
    [
      note.id,
      `"${String(note.text).replaceAll('"', '""')}"`,
      note.priority,
      `"${(note.tags || []).join(';')}"`,
      note.dueDate || '',
      note.recurrence || '',
      note.completed,
      note.createdAt,
    ].join(',')
  );

  fs.writeFileSync(filePath, [header, ...rows].join('\n'), 'utf8');
}

function exportMarkdown(notes, filePath) {
  ensureExportDirectory();

  let output = '# Notes\n\n';

  notes.forEach((note) => {
    output += `## ${note.text}\n`;
    output += `- ID: ${note.id}\n`;
    output += `- Priority: ${note.priority}\n`;
    output += `- Completed: ${note.completed}\n`;
    output += `- Due Date: ${note.dueDate || '-'}\n`;
    output += `- Recurrence: ${note.recurrence || '-'}\n`;
    output += `- Tags: ${(note.tags || []).join(', ') || '-'}\n`;
    output += `- Created: ${note.createdAt}\n\n`;
  });

  fs.writeFileSync(filePath, output, 'utf8');
}

function exportNotes(format) {
  ensureExportDirectory();

  repository.getAllNotes((err, notes) => {
    if (err) {
      console.error('Error:', err.message);
      return;
    }

    const exportConfig = getExporter(format);

    if (!exportConfig) {
      console.log('Unsupported export format.');
      return;
    }

    const timestamp = createTimestamp();
    const filename = `notes-${timestamp}.${exportConfig.extension}`;
    const filePath = path.join(EXPORT_DIRECTORY, filename);

    exportConfig.exporter(notes, filePath);

    console.log(`\n✔ Exported ${notes.length} notes`);
    console.log(filePath);
  });
}

module.exports = {
  EXPORT_DIRECTORY,
  exportNotes,
  exportJson,
  exportCsv,
  exportMarkdown,
  createTimestamp,
  ensureExportDirectory,
  getExporter,
};
