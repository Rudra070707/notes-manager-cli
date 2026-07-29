const schema = Object.freeze({
  defaultPriority: {
    type: 'enum',
    values: ['low', 'medium', 'high'],
  },

  defaultExportFormat: {
    type: 'enum',
    values: ['json', 'csv', 'md'],
  },

  dateFormat: {
    type: 'string',
  },

  theme: {
    type: 'string',
  },

  autoBackup: {
    type: 'boolean',
  },

  backupRetention: {
    type: 'number',
    min: 1,
    max: 100,
  },

  showCompletedByDefault: {
    type: 'boolean',
  },

  confirmBeforeClear: {
    type: 'boolean',
  },

  colorOutput: {
    type: 'boolean',
  },
});

function parseBoolean(value) {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  throw new TypeError('Expected true or false.');
}

function parseNumber(value, rule) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    throw new TypeError('Expected a number.');
  }

  if (rule.min !== undefined && number < rule.min) {
    throw new RangeError(`Minimum value is ${rule.min}.`);
  }

  if (rule.max !== undefined && number > rule.max) {
    throw new RangeError(`Maximum value is ${rule.max}.`);
  }

  return number;
}

function parseEnum(value, rule) {
  if (!rule.values.includes(value)) {
    throw new RangeError(`Allowed values: ${rule.values.join(', ')}`);
  }

  return value;
}

function parseValue(key, value) {
  const rule = schema[key];

  if (!rule) {
    throw new ReferenceError('Unknown configuration key.');
  }

  switch (rule.type) {
    case 'boolean':
      return parseBoolean(value);

    case 'number':
      return parseNumber(value, rule);

    case 'enum':
      return parseEnum(value, rule);

    case 'string':
    default:
      return value;
  }
}

module.exports = Object.freeze({
  parseValue,
});
