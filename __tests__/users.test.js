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

  it('should register a new user given an email and hashed password', function () {
    let name = 'Testy McTesterpants';
    let email = 'user@example.com';
    let hashedPassword = 'abc123';
    let profileData = {};

    return users.register(name, email, hashedPassword, null, profileData)
      .then((result) => {
        expect(result).not.toBe(false);
      });
  });

  it('should find user with findByEmail after register', function () {
    let name = 'Testy McTesterpants';
    let email = 'user2@example.com';
    let hashedPassword = 'abc123';
    let profileData = {};

    return users.register(name, email, hashedPassword, null, profileData)
      .then(() => {
        return users.findByEmail(email)
          .then((result) => {
            expect(result).not.toBe(false);
          });
      });
  });

  it('should not register a user with the same email address more than once (email is unique)', function () {
    let name = 'Testy McTesterpants';
    let email = 'user@example.com';
    let hashedPassword = 'abc123';
    let profileData = {};

    return users.register(name, email, hashedPassword, null, profileData)
      .then(() => {
        return users.register(name, email, hashedPassword, null, profileData)
          .then(() => {
            expect(false).toBe(true); // intentional fail
          })
          .catch(() => {
            expect(true).toBe(true); // intentional pass
          });
      });
  });

  it('should register a user with a valid username', function () {
    let name = 'Testy McTesterpants';
    let email = 'user@example.com';
    let hashedPassword = 'abc123';
    let username = 'testy_mctesterpants';
    let profileData = {};

    return users.register(name, email, hashedPassword, username, profileData)
      .then(user => {
        expect(user.username).toBe(username);
      })
  });

  it('should NOT register a user with a username on the blacklist', function () {
    let name = 'Testy McTesterpants';
    let email = 'user@example.com';
    let hashedPassword = 'abc123';
    let username = 'www';
    let profileData = {};

    return users.register(name, email, hashedPassword, username, profileData)
      .then(() => {
        expect(false).toBe(true); // intentional fail
      })
      .catch(() => {
        expect(true).toBe(true); // intentional pass
      });
  });

});
