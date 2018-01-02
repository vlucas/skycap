// NPM
const accepts = require('accepts');
const debug = require('debug')('skycap');
const passport = require('passport');

// Local
const { config } = require('./config');

/**
 * Create new user object with given data
 *
 * @param data object
 * @return SkycapUser
 */
function createUserObject(data) {
  return new SkycapUser(data);
}

/**
 * Format for API error
 */
function apiResponse(json, type) {
  let output = {
    data: {
      type,
      id: json.id,
      attributes: json,
    }
  };

  delete output.data.attributes.id;

  return output;
}

/**
 * create API error response
 */
function apiErrorResponse(err, statusCode = 500) {
  let json = {
    errors: [
      {
        status: String(statusCode),
        title: err.message || err,
      },
    ],
  };

  return json;
}

/**
 * Use passport auth with redirects
 */
function passportRedirectAuth(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    let defaultMessage = config.errors.user_bad_auth;

    if (err) {
      req.flash('skycap_errors', err.message);
      return next(err);
    }

    if (!user) {
      req.flash('skycap_errors', info.message || defaultMessage);
      return res.redirect(config.routes.user.login);
    }


    req.logIn(user, function(err) {
      if (err) {
        req.flash('skycap_errors', err.message);
        return next(err);
      }

      return res.redirect(config.redirects.loginSuccess);
    });
  })(req, res, next);
}

/**
 * Use passport auth with custom response for API
 */
function passportApiAuth(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    let unauthorizedStatus = 401;
    let accept = accepts(req);
    let isJson = accept.type(['html', 'json']) === 'json';

    if (err) {
      return res.status(unauthorizedStatus).json(apiErrorResponse(err, unauthorizedStatus));
    }

    if (!user) {
      return res.status(unauthorizedStatus).json(apiErrorResponse('User not logged in', unauthorizedStatus));
    }


    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }

      let userObj = createUserObject(user);

      return res.status(200).json(apiResponse(userObj.toJSON(), 'user'));
    });
  })(req, res, next);
}

/**
 * Main method of enforcing user logins and sessions
 */
function requireAdmin() {
  return function (req, res, next) {
    let accept = accepts(req);
    let isJson = accept.type(['html', 'json']) === 'json';

    if (req.isAuthenticated() && req.user.isAdmin()) {
      return next();
    }

    if (isJson) {
      return passportApiAuth(req, res, next);
    } else {
      return passportRedirectAuth(req, res, next);
    }
  };
}

/**
 * Main method of enforcing user logins and sessions
 */
function requireUser() {
  return function (req, res, next) {
    let accept = accepts(req);
    let isJson = accept.type(['html', 'json']) === 'json';

    if (req.isAuthenticated()) {
      debug('User already authenticated as =', req.user);
      return next();
    }


    if (isJson) {
      return passportApiAuth(req, res, next);
    } else {
      return passportRedirectAuth(req, res, next);
    }
  };
}

// Exports
module.exports = { requireAdmin, requireUser };
