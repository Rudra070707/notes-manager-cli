const fs = require('fs');
const path = require('path');

const defaultConfig = require('../config/defaultConfig');

const configPath = path.join(__dirname, '..', 'data', 'config.json');

function ensureConfigExists() {
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(
      configPath,
      JSON.stringify(defaultConfig, null, 2),
      'utf8'
    );
  }
}

function getConfig() {
  ensureConfigExists();

  try {
    const data = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(data);
  } catch {
    return { ...defaultConfig };
  }
}

function saveConfig(config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
}

function resetConfig() {
  saveConfig(defaultConfig);
}

module.exports = {
  configPath,
  ensureConfigExists,
  getConfig,
  saveConfig,
  resetConfig,
};
