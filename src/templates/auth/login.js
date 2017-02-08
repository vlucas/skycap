'use strict';

const config = require('../../config').config;
const tmpl = require('echotag').tmpl;

function render(params = {}) {
  return tmpl`
    <form action="${config.routes.login}" method="post">
      <fieldset>
        <legend>User Login</legend>

        <div class="form-element">
          <label for="username">Email</label>
          <input type="text" name="email" placeholder="user@example.com" class="form-input">
        </div>

        <div class="form-element">
          <label for="password">Password</label>
          <input type="password" name="password" placeholder="*********" class="form-input">
        </div>

        <button type="submit" class="button button-primary">Login</button>

      </fieldset>
    </form>
  `;
}

module.exports = { render };
