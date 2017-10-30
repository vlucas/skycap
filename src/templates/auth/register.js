'use strict';

const config = require('../../config').config;
const tmpl = require('echotag').tmpl;

function render(params = {}) {
  return tmpl`
    <div class="userauth register">
      <form action="${config.routes.user.register}" method="post">
        <fieldset>
          <legend>New User Registration</legend>

          <div class="form-group">
            <label class="form-label" for="username">Full Name</label>
            <input class="form-input" type="text" name="name" placeholder="John Doe">
          </div>

          <div class="form-group">
            <label class="form-label" for="username">Email</label>
            <input class="form-input" type="text" name="email" placeholder="user@example.com">
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input class="form-input" type="password" name="password" placeholder="*********">
          </div>

          <button type="submit" class="btn btn-primary">Register</button>

        </fieldset>
        <div>
          <p>Already have an account? <a href="${config.routes.user.login}">Login to your account</a></p>
        </div>
      </form>
    </div>
  `;
}

module.exports = { render };
