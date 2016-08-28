"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var FilterOnPropertyValueConverter, HasPropertyValueValueConverter;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _export("FilterOnPropertyValueConverter", FilterOnPropertyValueConverter = function () {
        function FilterOnPropertyValueConverter() {
          _classCallCheck(this, FilterOnPropertyValueConverter);
        }

        FilterOnPropertyValueConverter.prototype.toView = function toView(array, property, exp) {

          if (array === undefined || array === null || property === undefined || exp === undefined) {
            return array;
          }
          return array.filter(function (item) {
            exp = RegExp.escape(exp);
            if (exp.length > 0) {
              return new RegExp(exp, "gi").test(item[property][0]);
            } else {
              return true;
            }
          });
        };

        return FilterOnPropertyValueConverter;
      }());

      _export("FilterOnPropertyValueConverter", FilterOnPropertyValueConverter);

      RegExp.escape = function (s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      };

      _export("HasPropertyValueValueConverter", HasPropertyValueValueConverter = function () {
        function HasPropertyValueValueConverter() {
          _classCallCheck(this, HasPropertyValueValueConverter);
        }

        HasPropertyValueValueConverter.prototype.toView = function toView(array, property, exp) {

          if (array === undefined || array === null || property === undefined || exp === undefined) {
            return false;
          }
          return array.filter(function (item) {
            return item[property].toLowerCase().indexOf(exp.toLowerCase()) > -1;
          }).length > 0;
        };

        return HasPropertyValueValueConverter;
      }());

      _export("HasPropertyValueValueConverter", HasPropertyValueValueConverter);
    }
  };
});
//# sourceMappingURL=properties.js.map
