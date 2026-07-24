const configService = require('../services/configService');

module.exports = function config(args) {
  const action = args[0];

  switch (action) {
    case 'list':
      configService.listConfig();
      break;

    case 'get':
      configService.getValue(args[1]);
      break;

    case 'set':
      configService.setValue(args[1], args[2]);
      break;

    case 'reset':
      configService.resetConfig();
      break;

    default:
      console.log(`
Usage:

notes config list
notes config get <key>
notes config set <key> <value>
notes config reset
`);
  }
};
