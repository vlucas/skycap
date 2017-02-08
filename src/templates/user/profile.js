'use strict';

const tmpl = require('echotag').tmpl;

function render(params = {}) {
  let user = params.user;

  return tmpl`
    <div>
      <p>Welcome, logged in user!</p>
      <p>${user}</p>
    </div>
  `;
}

module.exports = { render };
