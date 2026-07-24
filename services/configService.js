const repository = require('../database/configRepository');
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

  if (!(key in config)) {
    ui.error('✖ Configuration key not found.');
    return;
  }

  console.log(config[key]);
}

function setValue(key, value) {
  const config = repository.getConfig();

  if (!(key in config)) {
    ui.error('✖ Configuration key not found.');
    return;
  }

  config[key] = value;

  repository.saveConfig(config);

  ui.success(`✔ ${key} updated successfully.`);
}

function resetConfig() {
  repository.resetConfig();

  ui.success('✔ Configuration reset successfully.');
}

module.exports = {
  listConfig,
  getValue,
  setValue,
  resetConfig,
};
