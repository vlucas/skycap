'use strict';

const _header = require('./_header');
const _footer = require('./_footer');
const tmpl = require('echotag').tmpl;

function render(params = {}) {
  return tmpl`
    ${_header.render()}:html
    <div class="container">
      <div class="content">
        ${params.content}:html
      </div>
    </div>
    ${_footer.render()}:html
  `;
}

module.exports = { render };
