'use strict';

const config = require('../../config').config;
const tmpl = require('echotag').tmpl;

function render() {
  return tmpl`
        </div>
        <script src="${config.routes.assets}/js/skycap.js"></script>
      </body>
    </html>
  `;
}

module.exports = { render };
