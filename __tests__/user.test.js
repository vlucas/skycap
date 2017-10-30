'use strict';

require('../__tests-server__/test-config');
const { config } = require('../src/config');
const frisby = require('frisby');

// Routes
let loginRoute = config.routes.user.login;

describe('User class', () => {

  it('should be available', (doneFn) => {
    frisby.get(loginRoute)
      .expect('status', 200)
      .done(doneFn);
  });

});
