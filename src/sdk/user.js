'use strict';

const bcrypt = require('bcryptjs');
const config = require('../config');

const cfg = config.config;

/**
 * Find an existsting user by email address
 *
 * @param email {String}
 *
 * @return {Promise}
 */
function findByEmail(email) {
  return config.getAdapter().findByEmail(email)
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
  return config.getAdapter().findByEmail(email)
    .then((user) => {
      if (!user || user.length === 0) {
        // No user found with email address
        return _error(cfg.errors.user_bad_email);
      }

      // Verify password
      return _verifyPassword(password, user.password)
        .then(() => {
          // GOOD auth - return loaded user
          return _formatUser(user);
        })
        .catch((err) => {
          // Incorrect password
          return _error(cfg.errors.user_bad_auth);
        });
    })
    .catch((err) => {
      // No user found with email address
      return _error(cfg.errors.user_bad_email);
    });
}

/**
 * Register a new user
 *
 * @param email {String}
 * @param password {String}
 * @param profileData {Object}
 *
 * @return {Promise}
 */
function register(email, password, profileData = {}) {
  return _hashPassword(password)
    .then((hashedPassword) => {
      return config.getAdapter().register(email, hashedPassword, profileData);
    });
}

function _error(msg) {
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

  return user;
}

module.exports = {
  findByEmail,
  findByEmailAndPassword,
  register,
};
