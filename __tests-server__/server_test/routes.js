'use strict';

const testConfig = require('../../__tests-server__/test-config');
const { config } = require('../../src/config');
const frisby = require('frisby');

// Routes
let loginRoute = config.routes.user.login;
let registerRoute = config.routes.user.register;

describe('GET ' + loginRoute, () => {

  it('should be available', (doneFn) => {
    frisby.get(loginRoute)
      .expect('status', 200)
      .done(doneFn);
  });

});

describe('POST ' + loginRoute, () => {

  it('should not login user that does not exist', (doneFn) => {
    frisby.post(loginRoute, { email: 'test', password: 'test' })
      .expect('status', 401)
      .done(doneFn);
  });

  it('should return success with valid user credentials', (doneFn) => {
    let user = testConfig.users.user;

    frisby.post(loginRoute, { email: user.email, password: user.password })
      .expect('status', 200)
      .done(doneFn);
  });

  it('should allow navigating to user profile after login', (doneFn) => {
    let user = testConfig.users.user;

    frisby.post(registerRoute, { email: user.email, password: user.password })
      .expect('status', 201)
      .then((res) => {
        console.log('>> Response headers =', res.headers);

        return frisby.post(loginRoute, { email: user.email, password: user.password })
          .expect('status', 200)
          .then((res) => {
            // Response should set cookie header
            let authCookie = res.headers.get('Set-Cookie');
            console.log('>> Response headers =', res.headers);
            authCookie = authCookie.substr(0, authCookie.indexOf(';'));

            return frisby.get(config.routes.user.profile, {
              headers: {
                'Cookie': authCookie
              }
            })
              .expect('status', 200);
          })
          .done(doneFn);
      });
  });

  // it('should allow navigating to user profile after login', (doneFn) => {
  //   let user = testConfig.users.user;
  //
  //   frisby.post(loginRoute, { email: user.email, password: user.password })
  //     .expect('status', 200)
  //     .then((res) => {
  //       // Response should set cookie header
  //       let authCookie = res.headers.get('Set-Cookie');
  //       console.log('authCookie =', res.headers);
  //       authCookie = authCookie.substr(0, authCookie.indexOf(';'));
  //
  //       return frisby.get(config.routes.user.profile, {
  //         headers: {
  //           'Cookie': authCookie
  //         }
  //       })
  //         .expect('status', 200);
  //     })
  //     .done(doneFn);
  // });

});
