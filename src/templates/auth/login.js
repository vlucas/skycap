'use strict';

const config = require('../../config').config;
const tmpl = require('echotag').tmpl;

function render(params = {}) {
  return tmpl`
    <div class="userauth login">
      <form action="${config.routes.user.login}" method="post">
        <fieldset>
          <legend>User Login</legend>

          <div class="form-group">
            <label class="form-label" for="username">Email</label>
            <input type="text" name="email" placeholder="user@example.com" class="form-input">
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input type="password" name="password" placeholder="*********" class="form-input">
          </div>

          <button type="submit" class="btn btn-primary">Login</button>

        </fieldset>
        <div>
          <p>Need to create an account? <a href="${config.routes.user.register}">Register New User</a></p>
        </div>
      </form>
    </div>
  `;
}

module.exports = { render };
