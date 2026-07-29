function filterNotes(notes = [], options = {}) {
  let filtered = [...notes];

  if (options.priority) {
    const priority = options.priority.toLowerCase();

    filtered = filtered.filter(
      (note) => (note.priority || 'medium') === priority
    );
  }

  if (options.tag) {
    const tag = options.tag.toLowerCase();

    filtered = filtered.filter((note) => (note.tags || []).includes(tag));
  }

  if (options.category) {
    const category = options.category.toLowerCase();

    filtered = filtered.filter(
      (note) => (note.category || 'General').toLowerCase() === category
    );
  }

  if (options.favorite) {
    filtered = filtered.filter((note) => note.is_favorite);
  }

  if (options.locked) {
    filtered = filtered.filter((note) => note.is_locked);
  }

  if (options.pinned) {
    filtered = filtered.filter((note) => note.is_pinned);
  }

  if (options.completed) {
    filtered = filtered.filter((note) => note.completed);
  }

  if (options.pending) {
    filtered = filtered.filter((note) => !note.completed);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (options.today) {
    filtered = filtered.filter((note) => {
      if (!note.dueDate) {
        return false;
      }

      const due = new Date(note.dueDate);
      due.setHours(0, 0, 0, 0);

      return due.getTime() === today.getTime();
    });
  }

  if (options.overdue) {
    filtered = filtered.filter((note) => {
      if (!note.dueDate) {
        return false;
      }

      const due = new Date(note.dueDate);
      due.setHours(0, 0, 0, 0);

      return due < today;
    });
  }

  if (options.upcoming) {
    filtered = filtered.filter((note) => {
      if (!note.dueDate) {
        return false;
      }

      const due = new Date(note.dueDate);
      due.setHours(0, 0, 0, 0);

      return due > today;
    });
  }

  if (options.thisWeek) {
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 7);

    filtered = filtered.filter((note) => {
      if (!note.dueDate) {
        return false;
      }

      const due = new Date(note.dueDate);
      due.setHours(0, 0, 0, 0);

      return due >= today && due <= endOfWeek;
    });
  }

  return filtered;
}

module.exports = {
  filterNotes,
};
