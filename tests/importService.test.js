jest.mock('../database/noteRepository', () => ({
  getNoteById: jest.fn(),
  addNote: jest.fn(),
}));

const fs = require('fs');

const repository = require('../database/noteRepository');

const {
  importJson,
  importCsv,
  importMarkdown,
} = require('../services/importService');

describe('Import Service', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('JSON Import', () => {
    test('should print message when file does not exist', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);

      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      importJson('missing.json');

      expect(logSpy).toHaveBeenCalledWith('File not found.');
    });

    test('should handle invalid JSON', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);

      jest.spyOn(fs, 'readFileSync').mockReturnValue('{ invalid json }');

      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      importJson('notes.json');

      expect(logSpy).toHaveBeenCalled();
    });

    test('should import a valid JSON note', () => {
      const notes = [
        {
          id: '1',
          text: 'Learn Jest',
          priority: 'High',
          tags: ['study'],
          dueDate: '',
          recurrence: '',
          completed: false,
          createdAt: '2026-07-15',
        },
      ];

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);

      jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(notes));

      repository.getNoteById.mockImplementation((id, callback) => {
        callback(null, null);
      });

      repository.addNote.mockImplementation((note, callback) => {
        callback(null);
      });

      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      importJson('notes.json');

      expect(repository.getNoteById).toHaveBeenCalledTimes(1);
      expect(repository.addNote).toHaveBeenCalledTimes(1);

      expect(repository.addNote).toHaveBeenCalledWith(
        notes[0],
        expect.any(Function)
      );

      expect(logSpy).toHaveBeenCalledWith('\n✔ Imported 1 notes');
      expect(logSpy).toHaveBeenCalledWith('✔ Skipped 0 duplicate notes');
    });

    test('should skip duplicate notes', () => {
      const notes = [
        {
          id: '1',
          text: 'Learn Jest',
          priority: 'High',
          tags: ['study'],
          dueDate: '',
          recurrence: '',
          completed: false,
          createdAt: '2026-07-15',
        },
      ];

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);

      jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(notes));

      repository.getNoteById.mockImplementation((id, callback) => {
        callback(null, notes[0]);
      });

      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      importJson('notes.json');

      expect(repository.getNoteById).toHaveBeenCalledTimes(1);
      expect(repository.addNote).not.toHaveBeenCalled();

      expect(logSpy).toHaveBeenCalledWith('\n✔ Imported 0 notes');
      expect(logSpy).toHaveBeenCalledWith('✔ Skipped 1 duplicate notes');
    });

    test('should handle repository lookup error', () => {
      const notes = [
        {
          id: '1',
          text: 'Learn Jest',
          priority: 'High',
          tags: [],
          dueDate: '',
          recurrence: '',
          completed: false,
          createdAt: '2026-07-15',
        },
      ];

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);

      jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(notes));

      repository.getNoteById.mockImplementation((id, callback) => {
        callback(new Error('Database Error'));
      });

      const errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      importJson('notes.json');

      expect(errorSpy).toHaveBeenCalledWith('Database Error');
    });

    test('should handle repository add error', () => {
      const notes = [
        {
          id: 1,
          text: 'Learn Jest',
          priority: 'High',
          tags: [],
          dueDate: '',
          recurrence: '',
          completed: false,
          createdAt: '2026-07-15',
        },
      ];

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);

      jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(notes));

      repository.getNoteById.mockImplementation((id, callback) => {
        callback(null, null);
      });

      repository.addNote.mockImplementation((note, callback) => {
        callback(new Error('Insert Failed'));
      });

      const errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      importJson('notes.json');

      expect(repository.addNote).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledWith('Insert Failed');
    });
  });

  describe('CSV Import', () => {
    test('should import a valid CSV note', () => {
      const csv =
        'id,text,priority,tags,dueDate,recurrence,completed,createdAt\n' +
        '1,"Learn CSV",High,study,,,false,2026-07-15';

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);

      jest.spyOn(fs, 'readFileSync').mockReturnValue(csv);

      repository.getNoteById.mockImplementation((id, callback) => {
        callback(null, null);
      });

      repository.addNote.mockImplementation((note, callback) => {
        callback(null);
      });

      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      importCsv('notes.csv');

      expect(repository.getNoteById).toHaveBeenCalledTimes(1);
      expect(repository.addNote).toHaveBeenCalledTimes(1);

      expect(logSpy).toHaveBeenCalledWith('\n✔ Imported 1 notes');
      expect(logSpy).toHaveBeenCalledWith('✔ Skipped 0 duplicate notes');
    });
  });

  describe('Markdown Import', () => {
    test('should import a valid Markdown note', () => {
      const markdown = `# Notes

## Learn Markdown
ID: 1
Priority: High
Completed: false
Due Date: -
Recurrence: -
Tags: study
Created At: 2026-07-15`;

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);

      jest.spyOn(fs, 'readFileSync').mockReturnValue(markdown);

      repository.getNoteById.mockImplementation((id, callback) => {
        callback(null, null);
      });

      repository.addNote.mockImplementation((note, callback) => {
        callback(null);
      });

      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      importMarkdown('notes.md');

      expect(repository.getNoteById).toHaveBeenCalledTimes(1);
      expect(repository.addNote).toHaveBeenCalledTimes(1);

      expect(logSpy).toHaveBeenCalledWith('\n✔ Imported 1 notes');
      expect(logSpy).toHaveBeenCalledWith('✔ Skipped 0 duplicate notes');
    });
  });
});
