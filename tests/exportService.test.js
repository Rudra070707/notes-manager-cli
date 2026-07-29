const fs = require('fs');
const path = require('path');

const {
  EXPORT_DIRECTORY,
  exportJson,
  exportCsv,
  exportMarkdown,
  createTimestamp,
  ensureExportDirectory,
  getExporter,
} = Object.freeze(require('../services/exportService'));

describe('Export Service', () => {
  const sampleNotes = [
    {
      id: '1',
      text: 'Learn Jest',
      priority: 'High',
      tags: ['study', 'node'],
      dueDate: '2026-07-31',
      recurrence: 'None',
      completed: false,
      createdAt: '2026-07-15',
    },
  ];

  afterAll(() => {
    if (fs.existsSync(EXPORT_DIRECTORY)) {
      fs.rmSync(EXPORT_DIRECTORY, {
        recursive: true,
        force: true,
      });
    }
  });

  test('should create a valid timestamp', () => {
    const timestamp = createTimestamp();

    expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}$/);
  });

  test('should create export directory if it does not exist', () => {
    if (fs.existsSync(EXPORT_DIRECTORY)) {
      fs.rmSync(EXPORT_DIRECTORY, {
        recursive: true,
        force: true,
      });
    }

    expect(fs.existsSync(EXPORT_DIRECTORY)).toBe(false);

    ensureExportDirectory();

    expect(fs.existsSync(EXPORT_DIRECTORY)).toBe(true);
  });

  test('should return JSON exporter', () => {
    const exporter = getExporter('json');

    expect(exporter.extension).toBe('json');
    expect(exporter.exporter).toBe(exportJson);
  });

  test('should return CSV exporter', () => {
    const exporter = getExporter('csv');

    expect(exporter.extension).toBe('csv');
    expect(exporter.exporter).toBe(exportCsv);
  });

  test('should return Markdown exporter', () => {
    const exporter = getExporter('markdown');

    expect(exporter.extension).toBe('md');
    expect(exporter.exporter).toBe(exportMarkdown);
  });

  test('should return Markdown exporter for md', () => {
    const exporter = getExporter('md');

    expect(exporter.extension).toBe('md');
    expect(exporter.exporter).toBe(exportMarkdown);
  });

  test('should return null for unsupported format', () => {
    expect(getExporter('xml')).toBeNull();
  });

  test('should export notes to JSON', () => {
    const filePath = path.join(EXPORT_DIRECTORY, 'test.json');

    exportJson(sampleNotes, filePath);

    expect(fs.existsSync(filePath)).toBe(true);

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    expect(data).toHaveLength(1);

    fs.unlinkSync(filePath);
  });

  test('should export notes to CSV', () => {
    const filePath = path.join(EXPORT_DIRECTORY, 'test.csv');

    exportCsv(sampleNotes, filePath);

    expect(fs.existsSync(filePath)).toBe(true);

    const data = fs.readFileSync(filePath, 'utf8');

    expect(data).toContain('Learn Jest');

    fs.unlinkSync(filePath);
  });

  test('should export notes to Markdown', () => {
    const filePath = path.join(EXPORT_DIRECTORY, 'test.md');

    exportMarkdown(sampleNotes, filePath);

    expect(fs.existsSync(filePath)).toBe(true);

    const data = fs.readFileSync(filePath, 'utf8');

    expect(data).toContain('# Notes');

    fs.unlinkSync(filePath);
  });
});
