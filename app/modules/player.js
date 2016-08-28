'use strict';

System.register(['aurelia-framework', 'aurelia-event-aggregator', '../events'], function (_export, _context) {
  "use strict";

  var customElement, bindable, inject, EventAggregator, PlayerPlay, PlayerNext, PlayerPrev, _dec, _class, _desc, _value, _class2, _descriptor, Player;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  return {
    setters: [function (_aureliaFramework) {
      customElement = _aureliaFramework.customElement;
      bindable = _aureliaFramework.bindable;
      inject = _aureliaFramework.inject;
    }, function (_aureliaEventAggregator) {
      EventAggregator = _aureliaEventAggregator.EventAggregator;
    }, function (_events) {
      PlayerPlay = _events.PlayerPlay;
      PlayerNext = _events.PlayerNext;
      PlayerPrev = _events.PlayerPrev;
    }],
    execute: function () {
      _export('Player', Player = (_dec = inject(Element, EventAggregator), _dec(_class = (_class2 = function () {
        function Player(element, ea) {
          var _this = this;

          _classCallCheck(this, Player);

          _initDefineProp(this, 'playPath', _descriptor, this);

          this.element = element;
          this.ea = ea;

          ea.subscribe(PlayerPlay, function (event) {
            _this.playPath = event.file.path;

            $(_this.element).find('audio').load();
          });
        }

        Player.prototype.playPrev = function playPrev() {
          this.ea.publish(new PlayerPrev());
        };

        Player.prototype.playNext = function playNext() {
          this.ea.publish(new PlayerNext());
        };

        return Player;
      }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'playPath', [bindable], {
        enumerable: true,
        initializer: null
      })), _class2)) || _class));

      _export('Player', Player);
    }
  };
});
//# sourceMappingURL=player.js.map
