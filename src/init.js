'use strict';

const bodyParser = require('body-parser');
const debug = require('debug')('skycap');
const express = require('express');
const session = require('express-session');

const { config, mergeConfig } = require('./config');
const SkycapAuth = require('./auth');

// Templates
const authLayout = require(config.paths.templates + '/layout/auth');
const authLogin = require(config.paths.templates + '/auth/login');
const authRegister = require(config.paths.templates + '/auth/register');
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

  // Setup database sessions
  app.use(adapterClass.useSession(session, config));

  // Passpord user serialization
  passport.serializeUser(function(user, done) {
    debug('serializeUser: ' + user.email)
    done(null, user.email);
  });

  passport.deserializeUser(function(email, done) {
    authAdapter.findByEmail(email)
      .then((user) => {
        debug('Deserialize USER =', user);
        done(null, user);
      })
      .catch((err) => {
        debug('Deserialize ERROR!', err);
        done(err, null);
      });
  });

  // Setup Passport
  app.use(passport.initialize());
  app.use(passport.session());
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
  app.get(config.routes.user.login, function (req, res) {
    let title = 'User Login';
    let content = authLogin.render();

    res.send(authLayout.render({ content, title }));
  });

  // Login process
  app.post(config.routes.user.login, auth(), function (req, res) {
    let user = req.user;

    // Success - redirect to use profile
    res.redirect(config.routes.user.profile);
  });

  // Register
  app.get(config.routes.user.register, function (req, res) {
    let title = 'Register New User';
    let content = authRegister.render();

    res.send(authLayout.render({ content, title }));
  });

  // Register process
  app.post(config.routes.user.register, function (req, res, next) {
    let { email, password } = req.body;
    let user = req.user;
    let profileData = null; // @TODO: Make this customizeable

    // Register new user
    authAdapter.register(email, password, profileData)
      .then((user) => {
        // Success - redirect to use profile
        res.redirect(config.routes.user.profile);
      })
      .catch((err) => {
        debug(err);
        next(err);
      });
  });

  // Profile
  app.get(config.routes.user.profile, auth(), function (req, res) {
    let title = 'User Profile';
    let content = userProfile.render();

    res.send(authLayout.render({ content, title }));
  });

  // Return Express.js middleware for mount() to work with express.use()
  return (req, res, next) => next();
}

/**
 * Auth - main method of enforcing user logins and sessions
 */
function auth() {
  return function (req, res, next) {
    if (req.user) {
      return next();
    }

    return passport.authenticate('local', {
      failureRedirect: config.routes.user.login,
      successRedirect: config.routes.user.profile
    })(req, res, next);
  };
}

module.exports = { auth, mount };
