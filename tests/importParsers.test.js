const {
  parseJson,
  parseCsv,
  parseMarkdown,
} = require('../utils/importParsers');

describe('Import Parsers', () => {
  test('should parse valid JSON', () => {
    const json = JSON.stringify([
      {
        id: 1,
        text: 'Learn Jest',
        priority: 'medium',
        tags: [],
        dueDate: null,
        recurrence: null,
        completed: false,
        createdAt: '2026-07-22T00:00:00.000Z',
      },
    ]);

    const notes = parseJson(json);

    expect(notes).toHaveLength(1);
    expect(notes[0].id).toBe(1);
    expect(notes[0].text).toBe('Learn Jest');
    expect(notes[0].priority).toBe('medium');
    expect(notes[0].completed).toBe(false);
  });

  test('should throw an error for invalid JSON format', () => {
    const invalidJson = JSON.stringify({
      id: 1,
      text: 'Not an array',
    });

    expect(() => {
      parseJson(invalidJson);
    }).toThrow('Invalid JSON format.');
  });

  test('should parse valid CSV', () => {
    const csv =
      'id,text,priority,tags,dueDate,recurrence,completed,createdAt\n' +
      '1,"Learn Jest",medium,,2026-08-01,daily,false,2026-07-22T00:00:00.000Z';

    const notes = parseCsv(csv);

    expect(notes).toHaveLength(1);
    expect(notes[0].id).toBe(1);
    expect(notes[0].text).toBe('Learn Jest');
    expect(notes[0].priority).toBe('medium');
    expect(notes[0].tags).toEqual([]);
    expect(notes[0].dueDate).toBe('2026-08-01');
    expect(notes[0].recurrence).toBe('daily');
    expect(notes[0].completed).toBe(false);
    expect(notes[0].createdAt).toBe('2026-07-22T00:00:00.000Z');
  });

  test('should parse valid Markdown', () => {
    const markdown = `# Notes

## Learn Jest

- ID: 1
- Priority: medium
- Completed: false
- Due Date: 2026-08-01
- Recurrence: daily
- Tags: node, testing
- Created: 2026-07-22T00:00:00.000Z`;

    const notes = parseMarkdown(markdown);

    expect(notes).toHaveLength(1);
    expect(notes[0].id).toBe(1);
    expect(notes[0].text).toBe('Learn Jest');
    expect(notes[0].priority).toBe('medium');
    expect(notes[0].completed).toBe(false);
    expect(notes[0].dueDate).toBe('2026-08-01');
    expect(notes[0].recurrence).toBe('daily');
    expect(notes[0].tags).toEqual(['node', 'testing']);
    expect(notes[0].createdAt).toBe('2026-07-22T00:00:00.000Z');
  });
});
