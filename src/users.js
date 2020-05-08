'use strict';

const bcrypt = require('bcryptjs');
const usernameBlacklist = require('the-big-username-blacklist');
// More bad usernames not currently on the big username blacklist
const skycapBlacklist = ['default', 'primary', 'secondary'];

const config = require('./config');

const cfg = config.getConfig();

/**
 * Find an existsting user by email address
 *
 * @param email {String}
 *
 * @return {Promise}
 */
function findByEmail(email) {
  return config.getAdapter().users.findByEmail(email)
    .then(_formatUser)
    .catch((err) => {
      // No user found with email address
      return _error(cfg.errors.user_bad_email);
    });
}

/**
 * Find an existsting user by email address and password
 *
 * @param email {String}
 * @param password {String}
 *
 * @return {Promise}
 */
function findByEmailAndPassword(email, password) {
  // Fetch user record
  return config.getAdapter().users.findByEmail(email)
    .then((user) => {
      if (!user || user.length === 0) {
        // No user found with email address
        return _error(cfg.errors.user_bad_email);
      }

      // Verify password
      return _verifyPassword(password, user.password)
        .then((result) => {
          if (result) {
            // GOOD auth - return loaded user
            return _runWithHook('authAfterLogin', _formatUser(user));
          } else {
            // Incorrect password
            return _error(cfg.errors.user_bad_auth, err);
          }
        });
    })
    .catch((err) => {
      // No user found with email address
      return _error(cfg.errors.user_bad_email, err);
    });
}

/**
 * Register a new user
 *
 * @param name {String}
 * @param email {String}
 * @param password {String}
 * @param username {String} - Optional
 * @param profileData {Object} - Optional additional data
 *
 * @return {Promise}
 */
function register(name, email, password, username = null, profileData = {}) {
  return _hashPassword(password)
    .then((hashedPassword) => {
      let lowerUser = typeof username === 'string' ? username.toLowerCase() : null;

      // Ensure username is not on blacklist
      if (lowerUser && !_isValidUsername(lowerUser)) {
        throw new Error('Username is not allowed. Please choose a different username.');
      }

      return config.getAdapter().users.register(name, email.toLowerCase(), hashedPassword, lowerUser, profileData)
        .then((user) => _runWithHook('authAfterRegister', user));
    });
}

function _error(msg, err = null) {
  if (err) {
    console.error(err);
  }

  throw new Error(msg);
}

function _hashPassword(password) {
  return bcrypt.hash(password, 10);
}

function _verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

function _formatUser(user) {
  // Don't leak password hash
  delete user.password;

  return _runWithHook('userFormat', user);
}

function _isValidUsername(username) {
  return usernameBlacklist.validate(username) && !skycapBlacklist.includes(username);
}

/**
 * Run through custom config hook if provided
 */
function _runWithHook(hookName, data) {
  let returnData;

  if (cfg.hooks && typeof cfg.hooks[hookName] === 'function') {
    returnData = cfg.hooks[hookName](data);
  }

  return returnData || data;
}

module.exports = {
  findByEmail,
  findByEmailAndPassword,
  register,
};
