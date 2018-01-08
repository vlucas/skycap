'use strict';

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const debug = require('debug')('skycap');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');

const { config, mergeConfig, setAdapter } = require('./config');
const { requireUser } = require('./middleware');
const SkycapUser = require('./skycapuser');

// SDK methods (require adapter to implement them)
const userSdk = require('./users');

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
function mount(app, adapter, options) {
  if (options) {
    mergeConfig(options);
  }

  if (!adapter) {
    throw new Error('An auth adapter must be set - please specify adapter');
  }

  // Set specified adapter
  setAdapter(adapter);

  // Setup sessions via adapter
  app.use(adapter.session.setup(session, config));

  // Passpord user serialization
  passport.serializeUser(function(user, done) {
    done(null, user.email);
  });

  passport.deserializeUser(function(email, done) {
    userSdk.findByEmail(email)
      .then((user) => {
        let userObj = new SkycapUser(user);

        done(null, userObj);
      })
      .catch((err) => {
        debug('User Deserialize ERROR!', err);
        done(err, false, { messge: err.message });
      });
  });

  // Setup Passport
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cookieParser());
  app.use(flash());
  app.use(bodyParser.urlencoded({ extended: true })); // Have to include body-parser or Passport won't pick up fields in form data
  app.use(bodyParser.json());
  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, function(email, password, done) {
    userSdk.findByEmailAndPassword(email, password)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(null, false, { message: err.message });
      });
  }));

  // Static assets
  app.use(config.routes.assets, express.static(config.paths.assets));

  // Login
  app.get(config.routes.user.login, function (req, res) {
    let errorMessages = req.flash('skycap_errors');
    let content = authLogin.render({ errorMessages });
    let title = 'User Login';

    res.send(authLayout.render({ content, title }));
  });

  // Login process
  app.post(config.routes.user.login, requireUser(), function (req, res) {
    // Success - redirect to use profile
    res.redirect(config.routes.user.profile);
  });

  // Register
  app.get(config.routes.user.register, function (req, res) {
    let content = authRegister.render();
    let title = 'Register New User';

    res.send(authLayout.render({ content, title }));
  });

  // Register process
  app.post(config.routes.user.register, function (req, res, next) {
    let { email, password } = req.body;
    let user = req.user;
    let profileData = null; // @TODO: Make this customizeable

    // Register new user
    userSdk.register(email, password, profileData)
      .then((user) => {
        // Log user in after successful registration
        req.login(user, function(err) {
          if (err) {
            return next(err);
          }

          // Success - redirect to user profile
          return res.redirect(config.routes.user.profile);
        });
      })
      .catch((err) => {
        debug(err);
        return next(err);
      });
  });

  // Profile
  app.get(config.routes.user.profile, requireUser(), function (req, res) {
    let user = req.user;
    let content = userProfile.render({ user });
    let title = 'User Profile';

    res.send(authLayout.render({ content, title }));
  });

  // Logout
  app.get(config.routes.user.logout, function(req, res){
    req.logout();
    res.redirect('/');
  });

  // Return Express.js middleware for mount() to work with express.use()
  return (req, res, next) => next();
}


module.exports = { setAdapter, mount };
