'use strict';

const path = require('path');

const config = {
  paths: {
    assets: path.join(__dirname, '../public'),
    templates: path.join(__dirname, 'templates')
  },

  // Public facing routes
  routes: {
    login: '/login',
    register: '/register',
    assets: '/_sk/assets'
  },

  // Branding options
  brand: {
    name: 'User Auth'
  }
};

module.exports = { config };
