function validateDueDate(dueDate) {
  if (!dueDate) {
    return null;
  }

  if (typeof dueDate !== "string") {
    return null;
  }

  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if (!regex.test(dueDate)) {
    return null;
  }

  const date = new Date(dueDate);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const [year, month, day] = dueDate.split("-").map(Number);

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return dueDate;
}

module.exports = {
  validateDueDate,
};
