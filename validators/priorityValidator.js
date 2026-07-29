const PRIORITIES = Object.freeze(['low', 'medium', 'high']);

function validatePriority(priority) {
  if (!priority) {
    return 'medium';
  }

  if (typeof priority !== 'string') {
    return null;
  }

  const value = priority.trim().toLowerCase();

  if (!PRIORITIES.includes(value)) {
    return null;
  }

  return value;
}

module.exports = Object.freeze({
  PRIORITIES,
  validatePriority,
});
