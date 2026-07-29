const fs = require('fs');
const path = require('path');

const {
  databasePath,
  backupDirectory,
  ensureBackupDirectory,
  getTimestamp,
} = require('../services/backupService');

const REMOVE_OPTIONS = {
  recursive: true,
  force: true,
};

describe('Backup Service', () => {
  beforeAll(() => {
    if (!fs.existsSync(databasePath)) {
      fs.mkdirSync(path.dirname(databasePath), { recursive: true });
      fs.writeFileSync(databasePath, 'Test Database');
    }
  });

  afterAll(() => {
    if (fs.existsSync(backupDirectory)) {
      fs.rmSync(backupDirectory, REMOVE_OPTIONS);
    }
  });

  test('should create a valid timestamp', () => {
    const timestamp = getTimestamp();

    expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}$/);
  });

  test('should create backup directory', () => {
    if (fs.existsSync(backupDirectory)) {
      fs.rmSync(backupDirectory, REMOVE_OPTIONS);
    }

    expect(fs.existsSync(backupDirectory)).toBe(false);

    ensureBackupDirectory();

    expect(fs.existsSync(backupDirectory)).toBe(true);
  });

  test('database file should exist', () => {
    expect(fs.existsSync(databasePath)).toBe(true);
  });

  test('backup directory path should end with backups', () => {
    expect(backupDirectory.endsWith('backups')).toBe(true);
  });
});
