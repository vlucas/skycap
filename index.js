'use strict';

const { mount, requireAdmin, requireUser } = require('./src/init');
const SkycapAuthAdapter = require('./src/auth/adapter');

module.exports = { mount, requireAdmin, requireUser, SkycapAuthAdapter };
