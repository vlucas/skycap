'use strict';

const { mount, auth } = require('./src/init');
const SkycapAuthAdapter = require('./src/auth/adapter');

module.exports = { auth, mount, SkycapAuthAdapter };
