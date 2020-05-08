'use strict';

const config = require('../../config').getConfig();
const tmpl = require('echotag').tmpl;

function render(params = {}) {
  let hasUsernameField = config.fields.username;
  let usernameField = hasUsernameField ? tmpl`
    <div class="form-group">
      <label class="form-label" for="username">Username</label>
      <input class="form-input" type="text" name="username" placeholder="johndoe" style="text-transform: lowercase" pattern="[A-Za-z0-9]+" required>
    </div>
  ` : '';

  return tmpl`
    <div class="userauth register">
      <form action="${config.routes.user.register}" method="post">
        <fieldset>
          <legend>New User Registration</legend>

          <div class="form-group">
            <label class="form-label" for="name">Full Name</label>
            <input class="form-input" type="text" name="name" placeholder="John Doe" required>
          </div>
          ${usernameField}:html

          <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <input class="form-input" type="email" name="email" placeholder="user@example.com" style="text-transform: lowercase" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input class="form-input" type="password" name="password" placeholder="*********" required>
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
