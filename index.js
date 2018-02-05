'use strict';

const { mount } = require('./src/init');
const { getAdapter, setAdapter } = require('./src/config');
const middleware = require('./src/middleware');
const users = require('./src/users');
const SkycapAuthAdapter = require('./src/auth/adapter');

module.exports = {
  getAdapter,
  setAdapter,
  mount,
  middleware,
  SkycapAuthAdapter,
  users,
};
