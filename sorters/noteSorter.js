const PRIORITY_ORDER = {
  high: 3,
  medium: 2,
  low: 1,
};

function comparePinnedAndFavorite(a, b) {
  // Pinned notes always come first
  const pinned = Number(b.is_pinned) - Number(a.is_pinned);
  if (pinned !== 0) return pinned;

  // Then favorite notes
  const favorite = Number(b.is_favorite) - Number(a.is_favorite);
  if (favorite !== 0) return favorite;

  return 0;
}

function sortNotes(notes, sortBy = 'created') {
  const sorted = [...notes];

  switch (sortBy) {
    case 'priority':
      sorted.sort((a, b) => {
        const order = comparePinnedAndFavorite(a, b);
        if (order !== 0) return order;

        return (
          PRIORITY_ORDER[b.priority || 'medium'] -
          PRIORITY_ORDER[a.priority || 'medium']
        );
      });
      break;

    case 'status':
      sorted.sort((a, b) => {
        const order = comparePinnedAndFavorite(a, b);
        if (order !== 0) return order;

        return Number(a.completed) - Number(b.completed);
      });
      break;

    case 'due':
      sorted.sort((a, b) => {
        const order = comparePinnedAndFavorite(a, b);
        if (order !== 0) return order;

        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        return new Date(a.dueDate) - new Date(b.dueDate);
      });
      break;

    case 'created':
    default:
      sorted.sort((a, b) => {
        const order = comparePinnedAndFavorite(a, b);
        if (order !== 0) return order;

        return new Date(a.createdAt) - new Date(b.createdAt);
      });
      break;
  }

  return sorted;
}

module.exports = {
  sortNotes,
};
