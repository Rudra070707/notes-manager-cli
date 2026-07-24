const schema = {
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
};

function parseValue(key, value) {
  const rule = schema[key];

  if (!rule) {
    throw new Error('Unknown configuration key.');
  }

  switch (rule.type) {
    case 'boolean':
      if (value === 'true') return true;
      if (value === 'false') return false;
      throw new Error('Expected true or false.');

    case 'number': {
      const number = Number(value);

      if (Number.isNaN(number)) {
        throw new Error('Expected a number.');
      }

      if (rule.min !== undefined && number < rule.min) {
        throw new Error(`Minimum value is ${rule.min}.`);
      }

      if (rule.max !== undefined && number > rule.max) {
        throw new Error(`Maximum value is ${rule.max}.`);
      }

      return number;
    }

    case 'enum':
      if (!rule.values.includes(value)) {
        throw new Error(`Allowed values: ${rule.values.join(', ')}`);
      }
      return value;

    default:
      return value;
  }
}

module.exports = {
  parseValue,
};
