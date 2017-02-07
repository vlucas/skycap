'use strict';

const tmpl = require('echotag').tmpl;
const config = require('../../config').config;

function render(params = {}) {
  let title = params.title || config.brand.name;

  return tmpl`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <link href="${config.routes.assets}/css/yeti.min.css" rel="stylesheet" />
        <link href="${config.routes.assets}/css/ionicons.min.css" rel="stylesheet" />
      </head>
      <body>
        <nav class="top-nav top-nav-light cf" role="navigation">
          <ul class="list-unstyled list-inline cf">
            <li><a class="brand" href="/"><i class="ion-person"></i> ${config.brand.name}</a></li>
          </ul>
        </nav>
  `;
}

module.exports = { render };
