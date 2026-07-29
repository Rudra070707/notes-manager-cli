const fs = require('node:fs');
const path = require('node:path');

const defaultConfig = require('../config/defaultConfig');

const dataDir = path.join(__dirname, '..', 'data');
const configPath = path.join(dataDir, 'config.json');

function ensureConfigExists() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

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
  ensureConfigExists();

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
