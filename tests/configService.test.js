const fs = require('node:fs');

const repository = require('../database/configRepository');
const defaultConfig = require('../config/defaultConfig');

const UPDATED_PRIORITY = 'high';

describe('Config Service', () => {
  beforeEach(() => {
    repository.resetConfig();
  });

  afterAll(() => {
    repository.resetConfig();
  });

  test('should load default configuration', () => {
    const config = repository.getConfig();

    expect(config).toEqual(defaultConfig);
  });

  test('should update configuration', () => {
    const config = repository.getConfig();

    config.defaultPriority = UPDATED_PRIORITY;

    repository.saveConfig(config);

    const updated = repository.getConfig();

    expect(updated.defaultPriority).toBe(UPDATED_PRIORITY);
  });

  test('should reset configuration', () => {
    const config = repository.getConfig();

    config.defaultPriority = UPDATED_PRIORITY;

    repository.saveConfig(config);

    repository.resetConfig();

    const reset = repository.getConfig();

    expect(reset.defaultPriority).toBe('medium');
  });

  test('config file should exist', () => {
    expect(fs.existsSync(repository.configPath)).toBe(true);
  });

  test('backup retention should be a number', () => {
    const config = repository.getConfig();

    expect(typeof config.backupRetention).toBe('number');
  });
});
