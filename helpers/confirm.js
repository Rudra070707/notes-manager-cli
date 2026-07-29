const prompts = require('prompts');

async function confirm(message) {
  try {
    const response = await prompts({
      type: 'confirm',
      name: 'value',
      message,
      initial: false,
    });

    return Boolean(response.value);
  } catch {
    return false;
  }
}

module.exports = {
  confirm,
};
