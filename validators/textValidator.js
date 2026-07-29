function validateText(text) {
  if (typeof text !== 'string') {
    return false;
  }

  if (text.trim().length === 0) {
    return false;
  }

  return true;
}

module.exports = Object.freeze({
  validateText,
});
