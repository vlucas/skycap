'use strict';

const bcrypt = require('bcryptjs');

const config = require('./config').config;
const SkycapAuthAdapter = require('./auth/adapter');

class SkycapAuth {
  constructor(adapter) {
    this.constructor.checkAdapter(adapter);
    this._adapter = adapter;
  }

  findByEmail(email) {
    return this._adapter.findByEmail(email)
      .then(this._formatUser);
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
        return this._verifyPassword(password, user.password)
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

  _hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  _verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  _formatUser(user) {
    // Don't leak password hash
    delete user.password;

    return user;
  }

  static checkAdapter(adapter) {
    // Turns out, 'instanceof' SUCKS for ES6 classes (among other things), so we have to also check a named property
    if (!(adapter instanceof SkycapAuthAdapter) && !adapter.SkycapAuthAdapter) {
      throw new Error('Skycap auth adapter set must extend SkycapAuthAdapter');
    }
  }
}

module.exports = SkycapAuth;
