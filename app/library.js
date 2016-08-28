'use strict';

System.register(['aurelia-framework', 'aurelia-event-aggregator', './events', 'aurelia-fetch-client', 'fetch', 'fs', 'node-dir', 'nedb-promise', 'musicmetadata'], function (_export, _context) {
  "use strict";

  var inject, EventAggregator, PlayerPlay, PlayerNext, PlayerPrev, HttpClient, FS, FSPath, DataBase, ID3, _typeof, _dec, _class, Library;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
    }, function (_aureliaEventAggregator) {
      EventAggregator = _aureliaEventAggregator.EventAggregator;
    }, function (_events) {
      PlayerPlay = _events.PlayerPlay;
      PlayerNext = _events.PlayerNext;
      PlayerPrev = _events.PlayerPrev;
    }, function (_aureliaFetchClient) {
      HttpClient = _aureliaFetchClient.HttpClient;
    }, function (_fetch) {}, function (_fs) {
      FS = _fs.default;
    }, function (_nodeDir) {
      FSPath = _nodeDir.default;
    }, function (_nedbPromise) {
      DataBase = _nedbPromise.default;
    }, function (_musicmetadata) {
      ID3 = _musicmetadata.default;
    }],
    execute: function () {
      _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
      };

      _export('Library', Library = (_dec = inject(HttpClient, FSPath, DataBase({ filename: 'library.db', autoload: true }), EventAggregator), _dec(_class = function () {
        function Library(http, fspath, db, ea) {
          var _this = this;

          _classCallCheck(this, Library);

          this.files = [];
          this.selectedId = null;

          this.fspath = fspath;
          this.db = db;
          this.ea = ea;

          ea.subscribe(PlayerNext, function () {
            _this.playNext();
          });

          ea.subscribe(PlayerPrev, function () {
            _this.playPrev();
          });

          this.db.cfind({}).sort({ artist: 1, album: 1 }).exec().then(function (files) {
            console.debug(files);
            _this.files = files;
          });
        }

        Library.prototype.activate = function activate() {};

        Library.prototype.clearPlaylist = function clearPlaylist() {
          var _this2 = this;

          this.db.remove({}, { multi: true }).then(function (results) {
            _this2.files = [];
          });
        };

        Library.prototype.playPath = function playPath(file) {
          this.ea.publish(new PlayerPlay(file));
          this.selectedId = file._id;
        };

        Library.prototype.getFilePaths = function getFilePaths(dirPath) {
          var _this3 = this;

          return new Promise(function (resolve, reject) {
            _this3.fspath.paths(dirPath, function (err, paths) {
              if (err) reject(err);
              resolve(paths);
            });
          });
        };

        Library.prototype.getFileId3 = function getFileId3(filePath) {
          return new Promise(function (resolve, reject) {
            ID3(FS.createReadStream(filePath), { duration: true }, function (err, tags) {
              if (err) reject(err);
              resolve(tags);
            });
          });
        };

        Library.prototype.getFileCover = function getFileCover(file) {
          var _this4 = this;

          this.getFileId3(file.path).then(function (info) {

            for (var i = 0; i < _this4.files.length; i++) {
              if (_this4.files[i]._id === file._id) {
                if (info.picture.length > 0) {
                  _this4.files[i].cover = 'data: image/' + info.picture[0].format + ';base64,' + info.picture[0].data.toString('base64');
                }
                break;
              }
            }
          });
          return true;
        };

        Library.prototype.selectedFiles = function selectedFiles(evt) {
          var _this5 = this;

          if (evt.target.files.length <= 0) {
            return false;
          }

          this.getFilePaths(evt.target.files[0].path).then(function (paths) {
            return paths.files.filter(function (file) {
              return (/\.(?:wav|mp3|ogg|oga|aac)$/i.test(file)
              );
            });
          }).then(function (paths) {
            var _loop = function _loop(f) {
              _this5.getFileId3(paths[f]).then(function (info) {
                _this5.db.update({ path: paths[f] }, { path: paths[f], artist: info.artist, album: info.album, song: info.title }, { upsert: true }).then(function (results) {
                  if ((typeof results === 'undefined' ? 'undefined' : _typeof(results)) == "object") {
                    var result = results[1];
                    _this5.files.push(result);
                  }
                }).catch(function (e) {
                  console.error(e.stack);
                });
              });
            };

            for (var f = 0; f < paths.length; f++) {
              _loop(f);
            }
          });
        };

        Library.prototype.playNext = function playNext() {
          for (var i = 0; i < this.files.length; i++) {
            if (this.files[i]._id === this.selectedId) {
              this.selectedId = this.files[i + 1]._id;
              this.playPath(this.files[i + 1]);
              break;
            }
          }
        };

        Library.prototype.playPrev = function playPrev() {
          for (var i = 0; i < this.files.length; i++) {
            if (this.files[i]._id === this.selectedId) {
              this.selectedId = this.files[i - 1]._id;
              this.playPath(this.files[i - 1]);
              break;
            }
          }
        };

        return Library;
      }()) || _class));

      _export('Library', Library);
    }
  };
});
//# sourceMappingURL=library.js.map
