'use strict';

const config = require('../../config').config;
const tmpl = require('echotag').tmpl;

function render(params = {}) {
  let user = params.user;

  return tmpl`
    <div>
      <p>Welcome, logged in user!</p>
      <p>${user.email}</p>
      <p><a href="${config.routes.user.logout}">Logout</a></p>
    </div>
  `;
}

module.exports = { render };
