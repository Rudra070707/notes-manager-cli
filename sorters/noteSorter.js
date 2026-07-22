const PRIORITY_ORDER = {
  high: 3,
  medium: 2,
  low: 1,
};

function sortNotes(notes, sortBy = "created") {
  const sorted = [...notes];

  switch (sortBy) {
    case "priority":
      sorted.sort(
        (a, b) => PRIORITY_ORDER[b.priority || "medium"] - PRIORITY_ORDER[a.priority || "medium"]
      );
      break;

    case "status":
      sorted.sort((a, b) => Number(a.completed) - Number(b.completed));
      break;

    case "created":
    default:
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
  }

  return sorted;
}

module.exports = {
  sortNotes,
};
