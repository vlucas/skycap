'use strict';

const frisby = require('frisby');
const PORT = 12345;

// Frisby setup
frisby.baseUrl('http://localhost:' + PORT);

let config = {
  users: {
    user: {
      email: 'user@example.com',
      password: 'password',
    },
    admin: {
      email: 'admin@example.com',
      password: 'password',
    },
  },
};

module.exports = config;
