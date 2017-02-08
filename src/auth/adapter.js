'use strict';

const bcrypt = require('bcryptjs');

class SkycapAuthAdapter {
  adapter(adapter) {
    this._adapter = adapter;
  }

  findByEmail(email) {
    this._notImplemented('findByEmail');
  }

  register(email, password) {
    this._ensureAdapter();
    this._notImplemented('register');
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

  _notImplemented(method) {
    this.error(`The method ${method} has not been implimented yet.`);
  }
}

module.exports = SkycapAuthAdapter;
