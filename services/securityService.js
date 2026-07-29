const bcrypt = require('bcrypt');
const prompt = require('prompt-sync')({ sigint: true });

const {
  saveSecret,
  getSecret,
  deleteSecret,
} = require('../database/securityRepository');

const ui = require('../ui/colors');
const logger = require('./loggerService');

const SALT_ROUNDS = 12;

/*
====================================
Set Master Secret
====================================
*/

async function setSecret(secret) {
  const value = String(secret ?? '').trim();

  if (!value) {
    ui.error('✖ Secret cannot be empty.');
    return;
  }

  try {
    const hash = await bcrypt.hash(value, SALT_ROUNDS);

    saveSecret(hash, (error) => {
      if (error) {
        logger.log('ERROR', `Failed to save master secret: ${error.message}`);
        ui.error('✖ Failed to save secret.');
        return;
      }

      ui.success('✔ Master secret configured.');
    });
  } catch (error) {
    logger.log('ERROR', `Failed to hash master secret: ${error.message}`);
    ui.error('✖ Failed to hash secret.');
  }
}

/*
====================================
Verify Secret
====================================
*/

async function verifySecret(secret) {
  return new Promise((resolve) => {
    getSecret(async (error, row) => {
      if (error) {
        logger.log(
          'ERROR',
          `Failed to retrieve master secret: ${error.message}`
        );
        resolve(false);
        return;
      }

      if (!row) {
        resolve(false);
        return;
      }

      try {
        const isValid = await bcrypt.compare(
          String(secret ?? ''),
          row.password_hash
        );

        resolve(isValid);
      } catch (error) {
        logger.log('ERROR', `Failed to verify master secret: ${error.message}`);
        resolve(false);
      }
    });
  });
}

/*
====================================
Authenticate User
====================================
*/

async function authenticate(message = 'Enter master PIN: ') {
  const enabled = await hasSecret();

  if (!enabled) {
    return true;
  }

  const secret = prompt.hide(message);

  const isValid = await verifySecret(secret);

  if (!isValid) {
    ui.error('✖ Authentication failed.');
    return false;
  }

  return true;
}

/*
====================================
Has Secret
====================================
*/

async function hasSecret() {
  return new Promise((resolve) => {
    getSecret((error, row) => {
      if (error) {
        logger.log('ERROR', `Failed to check master secret: ${error.message}`);
        resolve(false);
        return;
      }

      resolve(Boolean(row));
    });
  });
}

/*
====================================
Remove Secret
====================================
*/

function removeSecret() {
  deleteSecret((error) => {
    if (error) {
      logger.log('ERROR', `Failed to remove master secret: ${error.message}`);
      ui.error('✖ Failed to remove secret.');
      return;
    }

    ui.success('✔ Master secret removed.');
  });
}

module.exports = {
  setSecret,
  verifySecret,
  authenticate,
  hasSecret,
  removeSecret,
};
