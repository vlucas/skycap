'use strict';

const config = require('../../config').getConfig();
const tmpl = require('echotag').tmpl;

function render() {
  return tmpl`
        </div>
        <!-- script src="${config.routes.assets}/js/skycap.js"></script -->
        ${config.brand.js ? config.brand.js.map(js => tmpl`<script src="${js}"></script>`) : null}:html
      </body>
    </html>
  `;
}

module.exports = { render };
