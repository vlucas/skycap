'use strict';

const express = require('express');
const config = require('./config').config;
const authLayout = require(config.paths.templates + '/layout/auth');
const authLogin = require(config.paths.templates + '/auth/login');

function mount(app) {
  // Static assets
  app.use(config.routes.assets, express.static(config.paths.assets));

  // Login
  app.get('/login', function (req, res) {
    let content = authLogin.render();

    res.send(authLayout.render({ content }));
  });

  // Register
  app.get('/register', function (req, res) {
    let content = 'Register New User...';

    res.send(authLayout.render({ content }));
  });

  // Return empty Express.js middleware for mount() to work with express.use()
  return (req, res, next) => next();
}

module.exports = mount;
