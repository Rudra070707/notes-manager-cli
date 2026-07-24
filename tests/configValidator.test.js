const validator = require('../services/configValidator');

describe('Configuration Validator', () => {
  test('should accept valid priority', () => {
    expect(validator.parseValue('defaultPriority', 'high')).toBe('high');
  });

  test('should reject invalid priority', () => {
    expect(() => validator.parseValue('defaultPriority', 'banana')).toThrow();
  });

  test('should parse number', () => {
    expect(validator.parseValue('backupRetention', '25')).toBe(25);
  });

  test('should reject invalid number', () => {
    expect(() => validator.parseValue('backupRetention', 'abc')).toThrow();
  });

  test('should parse true boolean', () => {
    expect(validator.parseValue('autoBackup', 'true')).toBe(true);
  });

  test('should parse false boolean', () => {
    expect(validator.parseValue('autoBackup', 'false')).toBe(false);
  });

  test('should reject invalid boolean', () => {
    expect(() => validator.parseValue('autoBackup', 'hello')).toThrow();
  });

  test('should reject unknown configuration key', () => {
    expect(() => validator.parseValue('unknownKey', 'value')).toThrow();
  });

  test('should reject number below minimum', () => {
    expect(() => validator.parseValue('backupRetention', '0')).toThrow();
  });

  test('should reject number above maximum', () => {
    expect(() => validator.parseValue('backupRetention', '101')).toThrow();
  });
});
