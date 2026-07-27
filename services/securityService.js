const bcrypt = require('bcrypt');
const prompt = require('prompt-sync')({ sigint: true });

const {
  saveSecret,
  getSecret,
  deleteSecret,
} = require('../database/securityRepository');

const ui = require('../ui/colors');

const SALT_ROUNDS = 12;

/*
====================================
Set Master Secret
====================================
*/

async function setSecret(secret) {
  if (!secret || secret.trim() === '') {
    ui.error('✖ Secret cannot be empty.');
    return;
  }

  try {
    const hash = await bcrypt.hash(secret, SALT_ROUNDS);

    saveSecret(hash, (err) => {
      if (err) {
        ui.error('✖ Failed to save secret.');
        return;
      }

      ui.success('✔ Master secret configured.');
    });
  } catch {
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
    getSecret(async (err, row) => {
      if (err || !row) {
        resolve(false);
        return;
      }

      try {
        const ok = await bcrypt.compare(secret, row.password_hash);
        resolve(ok);
      } catch {
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

  const valid = await verifySecret(secret);

  if (!valid) {
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
    getSecret((err, row) => {
      if (err) {
        resolve(false);
        return;
      }

      resolve(!!row);
    });
  });
}

/*
====================================
Remove Secret
====================================
*/

function removeSecret() {
  deleteSecret((err) => {
    if (err) {
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
