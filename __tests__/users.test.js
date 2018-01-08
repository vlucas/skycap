'use strict';

const skycap = require('../index');
const memoryAdapter = require('skycap-adapter-memory');

// Set and use adapter for operations
skycap.setAdapter(memoryAdapter);
let users = skycap.users;


describe('users', function () {

  afterEach(function () {
    memoryAdapter.reset();
  });

  it('should register a new user given an email and hashed password', function (done) {
    let email = 'user@example.com';
    let hashedPassword = 'abc123';
    let profileData = {};

    users.register(email, hashedPassword, profileData)
      .then((result) => {
        expect(result).not.toBe(false);
        done();
      });
  });

  it('should find user with findByEmail after register', function (done) {
    let email = 'user2@example.com';
    let hashedPassword = 'abc123';
    let profileData = {};

    users.register(email, hashedPassword, profileData)
      .then(() => {
        users.findByEmail(email)
          .then((result) => {
            expect(result).not.toBe(false);
            done();
          });
      });
  });

  it('should not register a user with the same email address more than once (email is unique)', function (done) {
    let email = 'user@example.com';
    let hashedPassword = 'abc123';
    let profileData = {};

    users.register(email, hashedPassword, profileData)
      .then(() => {
        users.register(email, hashedPassword, profileData)
          .then(() => {
            expect(false).toBe(true); // intentional fail
            done();
          })
          .catch(() => {
            done();
          });
      });
  });

});
