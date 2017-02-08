'use strict';

const bodyParser = require('body-parser');
const debug = require('debug')('skycap');
const express = require('express');

const { config, mergeConfig } = require('./config');
const SkycapAuth = require('./auth');

// Templates
const authLayout = require(config.paths.templates + '/layout/auth');
const authLogin = require(config.paths.templates + '/auth/login');
const userProfile = require(config.paths.templates + '/user/profile');

// Passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

/**
 * Mount - Initialize skycap at the specified route of the Express.js app
 */
function mount(app, adapterClass, options) {
  if (options) {
    mergeConfig(options);
  }

  if (!adapterClass) {
    throw new Error('An auth adapter must be set - please specify adapterClass');
  }

  let authAdapter = new SkycapAuth(new adapterClass())

  // Setup Passport
  app.use(passport.initialize());
  app.use(bodyParser.urlencoded({ extended: true })); // Have to include body-parser or Passport won't pick up fields in form data
  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, function(email, password, done) {
    authAdapter.findByEmailAndPassword(email, password)
      .then((user) => {
        debug(user);
        done(null, user);
      })
      .catch((err) => {
        debug(err);
        done(err, false);
      });
  }));

  // Static assets
  app.use(config.routes.assets, express.static(config.paths.assets));

  // Login
  app.get(config.routes.login, function (req, res) {
    let content = authLogin.render();

    res.send(authLayout.render({ content }));
  });

  // Login process
  app.post(config.routes.login, auth(),  function (req, res) {
    let user = req.user;
    let content = userProfile.render({ user });

    res.send(authLayout.render({ content }));
  });

  // Register
  app.get(config.routes.register, function (req, res) {
    let content = 'Register New User...';

    res.send(authLayout.render({ content }));
  });

  // Return empty Express.js middleware for mount() to work with express.use()
  return (req, res, next) => next();
}

/**
 * Auth - main method of enforcing user logins and sessions
 */
function auth() {
  return passport.authenticate('local', { failureRedirect: config.routes.login });
}

module.exports = { auth, mount };
