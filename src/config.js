'use strict';

const path = require('path');

let config = {
  adapter: null,

  // Paths for templates, assets, etc.
  paths: {
    assets: path.join(__dirname, '../public'),
    templates: path.join(__dirname, 'templates')
  },

  // Public facing routes
  routes: {
    assets: '/_sc/assets',
    user: {
      login: '/login',
      profile: '/profile',
      register: '/register'
    }
  },

  // Branding options
  brand: {
    name: 'User Auth'
  },

  errors: {
    user_bad_email: 'Incorrect email/password combination',
    user_bad_auth: 'Incorrect email/password combination'
  }
};

function mergeConfig(options) {
  config = Object.assign(config, options);
}

module.exports = { config, mergeConfig };
