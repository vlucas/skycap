'use strict';

const config = require('./config').config;
const SkycapAuthAdapter = require('./auth/adapter');

class SkycapAuth {
  constructor(adapter) {
    this.constructor.checkAdapter(adapter);
    this._adapter = adapter;
  }

  findByEmailAndPassword(email, password) {
    // Fetch user record
    return this._adapter.findByEmail(email)
      .then((user) => {
        if (!user || user.length === 0) {
          // No user found with email address
          return this.error(config.errors.user_bad_email);
        }

        // Verify password
        return this._verifyPassword(password)
          .then(() => {
            // GOOD auth - return loaded user
            return this._formatUser(user);
          })
          .catch((err) => {
            // Incorrect password
            return this.error(config.errors.user_bad_auth);
          });
      })
      .catch((err) => {
        // No user found with email address
        return this.error(config.errors.user_bad_email);
      });
  }

  register(email, password, profile_data = {}) {
    return this._hashPassword(password)
      .then((hashedPassword) => {
        return this._adapter.register(email, hashedPassword, profile_data);
      })
      .catch((err) => {
        this.error(err.message);
      });
  }

  error(msg) {
    throw new Error(msg);
  }

  _formatUser(user) {
    return user; // Pass-through for now...
  }

  static checkAdapter(adapter) {
    if (!(adapter instanceof SkycapAuthAdapter)) {
      throw new Error('Skycap auth adapter set must extend SkycapAuthAdapter');
    }
  }
}

module.exports = SkycapAuth;
