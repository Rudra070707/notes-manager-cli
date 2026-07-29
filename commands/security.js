const prompt = require('prompt-sync')({ sigint: true });

const {
  setSecret,
  verifySecret,
  hasSecret,
  removeSecret,
} = require('../services/securityService');

const ui = require('../ui/colors');

async function execute(args) {
  const action = args[0];

  switch (action) {
    case 'set': {
      const secret = prompt.hide('Enter master PIN: ');
      const confirm = prompt.hide('Confirm master PIN: ');

      if (secret !== confirm) {
        ui.error('✖ PINs do not match.');
        return;
      }

      await setSecret(secret);
      break;
    }

    case 'verify': {
      const secret = prompt.hide('Enter master PIN: ');

      const valid = await verifySecret(secret);

      if (valid) {
        ui.success('✔ Authentication successful.');
      } else {
        ui.error('✖ Invalid PIN.');
      }

      break;
    }

    case 'status': {
      const exists = await hasSecret();

      if (exists) {
        ui.success('✔ Security is enabled.');
      } else {
        ui.warning('Security is not configured.');
      }

      break;
    }

    case 'remove': {
      const secret = prompt.hide('Enter current PIN: ');

      const valid = await verifySecret(secret);

      if (!valid) {
        ui.error('✖ Invalid PIN.');
        return;
      }

      removeSecret();
      break;
    }

    default:
      ui.info('');
      console.log('Security Commands');
      console.log('-----------------');
      console.log('notes security set');
      console.log('notes security verify');
      console.log('notes security status');
      console.log('notes security remove');
  }
}

module.exports = execute;
