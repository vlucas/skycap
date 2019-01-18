'use strict';

const config = require('../../config').getConfig();
const tmpl = require('echotag').tmpl;

function render(params = {}) {
  let title = params.title || config.brand.name;

  return tmpl`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <link href="${config.routes.assets}/css/spectre.min.css" rel="stylesheet" />
        <link href="${config.routes.assets}/css/skycap.css" rel="stylesheet" />
        <link href="${config.routes.assets}/css/ionicons.min.css" rel="stylesheet" />
      </head>
      <body>
        <div class="container">
          <header class="navbar">
            <section class="navbar-section">
              <a href="#" class="navbar-brand mr-2"><i class="ion-person"></i> ${config.brand.name}</a>
            </section>
            <section class="navbar-section">
              &nbsp;
            </section>
          </header>
  `;
}

module.exports = { render };
