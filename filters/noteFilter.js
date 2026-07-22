function filterNotes(notes, options = {}) {
  let filtered = [...notes];

  if (options.priority) {
    filtered = filtered.filter(
      (note) => (note.priority || "medium") === options.priority.toLowerCase()
    );
  }

  if (options.tag) {
    const tag = options.tag.toLowerCase();

    filtered = filtered.filter((note) => (note.tags || []).includes(tag));
  }

  if (options.completed) {
    filtered = filtered.filter((note) => note.completed);
  }

  if (options.pending) {
    filtered = filtered.filter((note) => !note.completed);
  }

  return filtered;
}

module.exports = {
  filterNotes,
};
