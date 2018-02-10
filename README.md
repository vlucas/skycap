# Skycap

Drop-in authentication and authoriztion framework for Express.js

## NO OFFICIAL RELEASE YET

Skycap is in the infant stages of just an idea of something that might be cool.
Don't use this in your project yet! :)

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

// Set your Knex.js connection instance
skycapKnex.setConnection(knex); // Where 'knex' is your Knex.js connection

// Mount Skycap with Express.js
app.use(skycap.mount(app, skycapKnex));
```
