const PRIORITIES = ['low', 'medium', 'high'];

function validatePriority(priority) {
  if (!priority) {
    return 'medium';
  }

  const value = priority.toLowerCase().trim();

  if (!PRIORITIES.includes(value)) {
    return null;
  }

  return value;
}

module.exports = {
  PRIORITIES,
  validatePriority,
};
