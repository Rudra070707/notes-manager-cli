function validateRecurrence(recurrence) {
  if (!recurrence) return null;

  if (typeof recurrence !== 'string') return null;

  const value = recurrence.toLowerCase();

  const allowed = ['daily', 'weekly', 'monthly'];

  if (!allowed.includes(value)) {
    return null;
  }

  return value;
}

module.exports = {
  validateRecurrence,
};
