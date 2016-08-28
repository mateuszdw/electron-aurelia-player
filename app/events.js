"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var PlayerPlay, PlayerNext, PlayerPrev;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _export("PlayerPlay", PlayerPlay = function PlayerPlay(file) {
        _classCallCheck(this, PlayerPlay);

        this.file = file;
      });

      _export("PlayerPlay", PlayerPlay);

      _export("PlayerNext", PlayerNext = function PlayerNext() {
        _classCallCheck(this, PlayerNext);
      });

      _export("PlayerNext", PlayerNext);

      _export("PlayerPrev", PlayerPrev = function PlayerPrev() {
        _classCallCheck(this, PlayerPrev);
      });

      _export("PlayerPrev", PlayerPrev);
    }
  };
});
//# sourceMappingURL=events.js.map
