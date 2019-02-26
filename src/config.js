'use strict';

const path = require('path');
const mergeOptions = require('merge-options');
let _adapter;

let config = {
  // Paths for templates, assets, etc.
  paths: {
    assets: path.join(__dirname, '../public'),
    templates: path.join(__dirname, 'templates'),
  },

  // Public facing routes
  routes: {
    assets: '/_sc/assets',
    user: {
      login: '/login',
      logout: '/logout',
      profile: '/profile',
      register: '/register',
    }
  },

  // Redirect user to where after login?
  redirects: {
    home: '/',
    loginSuccess: '/',
    registerSuccess: '/',
  },

  // Branding options
  brand: {
    name: 'User Auth',
    href: '/',
    css: [],
    js: [],
  },

  errors: {
    user_bad_email: 'Incorrect email/password combination',
    user_bad_auth: 'Incorrect email/password combination',
  },

  fields: {
    username: false,
    custom: [],
  },

  // Extension hooks for customization
  hooks: {
    authAfterLogin: undefined,
    authAfterRegister: undefined,
    userFormat: undefined,
  },
};

function mergeConfig(options) {
  config = mergeOptions(config, options);
  return config;
}

/**
 * Set adapter to use for database/persistence
 *
 * @param {Object} should be skycap adapter (skycap-adapter-memory, skycap-adapter-knex, etc.)
 */
function setAdapter(adapter) {
  _adapter = adapter;
}

/**
 * Get adapter that has been set
 *
 * @throws {Error} If adapter has not yet been set
 * @return {Object}
 */
function getAdapter() {
  if (_adapter === undefined) {
    throw new Error('[skycap] Adapter not set! Set one using skycap.setAdapter()');
  }

  return _adapter;
}

/**
 * Return config object
 *
 * @return {Object}
 */
function getConfig() {
  return config;
}

module.exports = {
  getConfig,
  mergeConfig,
  getAdapter,
  setAdapter,
};
