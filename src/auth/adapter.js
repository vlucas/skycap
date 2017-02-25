'use strict';

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

  _notImplemented(method) {
    this.error(`The method ${method} has not been implimented yet.`);
  }
}

module.exports = SkycapAuthAdapter;
