# Skycap

Drop-in authentication and authoriztion framework for Express.js

## NO OFFICIAL RELEASE YET

Although I am using Skycap in a few of my own projects, it's not quite ready
for use yet, and is not supported.  Don't use this in your project yet! :)

## Installation

Install skycap with NPM:

```
npm install skycap --save
```

Install the Skycap adapter of your choice (Knex.js in this example):

```
npm install skycap-adapter-knex --save
```

Require it in your Express.js Node service, and mount it with `app.use`:

```javascript
// Require Skycap + Your Adapter
const skycap = require('skycap');
const skycapKnex = require('skycap-adapter-knex');

// Skycap custom config
const skycapConfig = {
  brand: {
    name: 'MySite, Inc.',
    href: '/',
    css: [
      '/css/bootstrap.min.css',
      '/css/main.css',
    ],
    js: [
      '/js/yayquery.js',
    ],
  },
  fields: {
    username: true, // false by default (email-only login)
  },
  hooks: {
    authAfterRegister: async function _afterUserRegister(user) { // after successful user registration
      // Add user's email to a mailing list? Maybe? Dunno.
      return user; // Don't forget to return the user object!
    },
    authAfterLogin: undefined, // after successful user login
    userFormat: undefined, // Format the user object from raw data
  },
  redirects: {
    loginSuccess: '/dashboard',
    registerSuccess: '/dashboard/?newuser=true',
  },
};

// Set your Knex.js connection instance
skycapKnex.setConnection(knex); // Where 'knex' is your Knex.js connection

// Mount Skycap with Express.js
app.use(skycap.mount(app, skycapKnex, skycapConfig));
```

### Database Migrations

If you are using Skycap with Knex.js (via the `skycap-adapter-knex` package),
generate a new migrate file via `knex migrate:make skycap`, and put this in
it:

```javascript
const normalizedPath = require("path").join(__dirname, "../node_modules/skycap-adapter-knex/migrations");
let migrates = [];

// Require all migrations in Skycap
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  let filePath = normalizedPath + "/" + file;

  migrates.push(require(filePath));
});

exports.up = function(knex, Promise) {
  // Up in ORDER
  return Promise.all(migrates.map(m => m.up(knex, Promise)));
};

exports.down = function(knex, Promise) {
  // Down in REVERSE ORDER
  return Promise.all(migrates.reverse().map(m => m.down(knex, Promise)));
};
```

## Usage

Once configured, use Skycap provided middleware in your Express.js routes to
enforce user logins with `loadUser`, `requireUser`, or `requireAdmin`:

```javascript
const { loadUser, requireUser, requireAdmin } = require('skycap').middleware;

app.get('/', loadUser(), function(req, res) {
  // Loads user object into 'req.user' if logged-in
  // Still allows non logged-in users to view route (will not throw error or redirect)
});

app.get('/dashboard', requireUser(), function(req, res) {
  // Loads user object into 'req.user' if logged in
  // Redirects to '/login' (config.routes.user.login) if user is not logged in
});

app.get('/admin', requireAdmin(), function(req, res) {
  // Loads user object into 'req.user' if logged in
  // Redirects to '/login' (config.routes.user.login) if user is not logged in
  // Throws error if logged in user is not admin (req.user.isAdmin())
});
```

### Usage With an API

Skycap detects the request `Content-Type`, and responds with JSON for API
requests with `application/json`, and HTML and redirects for `text/html`
requests.
