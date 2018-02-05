'use strict';

const express = require('express');
const app = express();
const frisby = require('frisby');
const memoryAdapter = require('skycap-adapter-memory');
const skycap = require('../index');

const PORT = 12345;

// Mount skycap
app.use(skycap.mount(app, memoryAdapter));
let server = app.listen(PORT);

// Frisby setup
frisby.baseUrl('http://localhost:' + PORT);

// Exports
module.exports = { app, server };
