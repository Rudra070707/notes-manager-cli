const repository = require('../database/configRepository');
const validator = require('./configValidator');
const ui = require('../ui/colors');

function listConfig() {
  const config = repository.getConfig();

  ui.heading('\nCurrent Configuration');
  ui.divider();

  Object.entries(config).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
}

function getValue(key) {
  const config = repository.getConfig();

  if (!Object.hasOwn(config, key)) {
    ui.error('✖ Configuration key not found.');
    return;
  }

  console.log(config[key]);
}

function setValue(key, value) {
  const config = repository.getConfig();

  if (!Object.hasOwn(config, key)) {
    ui.error('✖ Configuration key not found.');
    return;
  }

  try {
    const parsedValue = validator.parseValue(key, value);

    config[key] = parsedValue;

    repository.saveConfig(config);

    ui.success(`✔ ${key} updated successfully.`);
  } catch (error) {
    ui.error(`✖ ${error.message}`);
  }
}

function resetConfig() {
  repository.resetConfig();

  ui.success('✔ Configuration reset successfully.');
}

module.exports = Object.freeze({
  listConfig,
  getValue,
  setValue,
  resetConfig,
});
