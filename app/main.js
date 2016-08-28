'use strict';

System.register(['jquery', 'bootstrap'], function (_export, _context) {
  "use strict";

  var jQuery;
  function configure(aurelia) {
    aurelia.use.standardConfiguration().developmentLogging();

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }

  _export('configure', configure);

  return {
    setters: [function (_jquery) {
      jQuery = _jquery;
    }, function (_bootstrap) {}],
    execute: function () {}
  };
});
//# sourceMappingURL=main.js.map
