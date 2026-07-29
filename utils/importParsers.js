function parseJson(content) {
  const notes = JSON.parse(content);

  if (!Array.isArray(notes)) {
    throw new TypeError('Invalid JSON format.');
  }

  return notes;
}

function parseCsv(content) {
  const lines = content.trim().split(/\r?\n/);

  lines.shift();

  return lines.map((line) => {
    const parts = line.split(',');

    return {
      id: Number(parts[0]),
      text: parts[1].replace(/^"|"$/g, '').replaceAll('""', '"'),
      priority: parts[2],
      tags: parts[3]
        ? parts[3].replace(/^"|"$/g, '').split(';').filter(Boolean)
        : [],
      dueDate: parts[4] || null,
      recurrence: parts[5] || null,
      completed: parts[6] === 'true',
      createdAt: parts[7],
    };
  });
}

function parseMarkdown(content) {
  const sections = content.split('\n## ').slice(1);

  return sections.map((section) => {
    const lines = section
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line !== '');

    const text = lines[0].trim();

    const getValue = (line) => line.substring(line.indexOf(':') + 2);

    return {
      id: Number(getValue(lines[1])),
      text,
      priority: getValue(lines[2]),
      completed: getValue(lines[3]) === 'true',
      dueDate: getValue(lines[4]) === '-' ? null : getValue(lines[4]),
      recurrence: getValue(lines[5]) === '-' ? null : getValue(lines[5]),
      tags:
        getValue(lines[6]) === '-'
          ? []
          : getValue(lines[6]).split(', ').filter(Boolean),
      createdAt: getValue(lines[7]),
    };
  });
}

module.exports = Object.freeze({
  parseJson,
  parseCsv,
  parseMarkdown,
});
