'use strict';

const tmpl = require('echotag').tmpl;

function render(params = {}) {
  return tmpl`
    <form action="/login" method="post">
      <fieldset>
        <legend>User Login</legend>

        <div class="form-element">
          <label for="username">Email</label>
          <input type="text" id="email" placeholder="user@example.com" class="form-input">
        </div>

        <div class="form-element">
          <label for="password">Password</label>
          <input type="password" id="password" placeholder="*********" class="form-input">
        </div>

        <button type="submit" class="button button-primary">Login</button>

      </fieldset>
    </form>
  `;
}

module.exports = { render };
