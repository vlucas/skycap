'use strict';

const _header = require('./_header');
const _footer = require('./_footer');
const tmpl = require('echotag').tmpl;

function render(params = {}) {
  return tmpl`
    ${_header.render()}:html
    <div class="container">
      ${renderFlashMessages(params.messages)}:html
      <div class="content">
        ${params.content}:html
      </div>
    </div>
    ${_footer.render()}:html
  `;
}

function renderFlashMessages(messages) {
  if (!messages || messages.length === 0) {
    return;
  }

  let errors = messages.error || [];

  if (!errors || errors.length === 0) {
    return;
  }

  return tmpl`
    <div class='message message-error'>
      ${errors.map((msg) => {
        return tmpl`<p>${msg}</p>`;
      })}:html
    </div>
  `;
}

module.exports = { render };
