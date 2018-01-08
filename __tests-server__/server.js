'use strict';

const { config } = require('../src/config');
const { mount } = require('../src/init');
const express = require('express');
const app = express();
const frisby = require('frisby');

const PORT = 12345;
const SkycapAdapterMemory = require('skycap-adapter-memory');

// Mount skycap
app.use(mount(app, SkycapAdapterMemory));
let server = app.listen(PORT);

// Frisby setup
frisby.baseUrl('http://localhost:' + PORT);

// Exports
module.exports = { app, server };
