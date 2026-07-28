function validateTag(tag) {
  if (!tag) {
    return [];
  }

  if (typeof tag !== 'string') {
    return [];
  }

  const tags = tag
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  return [...new Set(tags)];
}

module.exports = {
  validateTag,
};
