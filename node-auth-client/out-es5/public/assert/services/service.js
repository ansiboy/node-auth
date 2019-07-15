"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

define(["require", "exports", "maishu-chitu-service"], function (require, exports, maishu_chitu_service_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var Service =
  /*#__PURE__*/
  function (_maishu_chitu_service) {
    _inherits(Service, _maishu_chitu_service);

    function Service() {
      _classCallCheck(this, Service);

      return _possibleConstructorReturn(this, _getPrototypeOf(Service).apply(this, arguments));
    }

    _createClass(Service, [{
      key: "ajax",
      value: function ajax(url, options) {
        var _this = this;

        var _super = Object.create(null, {
          ajax: {
            get: function get() {
              return _get(_getPrototypeOf(Service.prototype), "ajax", _this);
            }
          }
        });

        return __awaiter(this, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          var data, obj, d, keys, i, key, k;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  options = options || {};
                  options.headers = options.headers || {};
                  if (Service.loginInfo.value) options.headers['token'] = Service.loginInfo.value.token;
                  if (Service.applicationId) options.headers['application-id'] = typeof Service.applicationId == 'function' ? Service.applicationId() : Service.applicationId;
                  _context.next = 6;
                  return _super.ajax.call(this, url, options);

                case 6:
                  data = _context.sent;

                  if (!(data == null)) {
                    _context.next = 9;
                    break;
                  }

                  return _context.abrupt("return", null);

                case 9:
                  obj = data;

                  if (!(obj.code && obj.message)) {
                    _context.next = 12;
                    break;
                  }

                  throw new Error(obj.message);

                case 12:
                  if (obj != null && obj['DataItems'] != null && obj['TotalRowCount'] != null) {
                    d = {};
                    keys = Object.keys(data);

                    for (i = 0; i < keys.length; i++) {
                      key = keys[i];
                      k = key[0].toLowerCase() + key.substr(1);
                      d[k] = obj[key];
                    }

                    data = d;
                  }

                  Service.travelJSON(data);
                  return _context.abrupt("return", data);

                case 15:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));
      }
      /**
       * 遍历 JSON 对象各个字段，将日期字符串转换为 Date 对象
       * @param obj 要转换的 JSON 对象
       */

    }], [{
      key: "getStorageLoginInfo",
      value: function getStorageLoginInfo() {
        var loginInfoSerialString = this.getCookie(Service.LoginInfoStorageName);
        if (!loginInfoSerialString) return null;

        try {
          var loginInfo = JSON.parse(loginInfoSerialString);
          return loginInfo;
        } catch (e) {
          console.error(e);
          console.log(loginInfoSerialString);
          return null;
        }
      }
    }, {
      key: "setStorageLoginInfo",
      value: function setStorageLoginInfo(value) {
        if (value == null) {
          this.removeCookie(Service.LoginInfoStorageName);
          return;
        }

        this.setCookie(Service.LoginInfoStorageName, JSON.stringify(value), 1000);
      }
    }, {
      key: "setCookie",
      value: function setCookie(name, value, days) {
        // nodejs 没有 document
        if (typeof document == 'undefined') return;
        var expires = "";

        if (days) {
          var date = new Date();
          date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
          expires = "; expires=" + date.toUTCString();
        }

        document.cookie = name + "=" + (value || "") + expires + "; path=/";
      }
    }, {
      key: "getCookie",
      value: function getCookie(name) {
        if (typeof document == 'undefined') return null;
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');

        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];

          while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
          }

          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }

        return null;
      }
    }, {
      key: "removeCookie",
      value: function removeCookie(name) {
        // document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        this.setCookie(name, '');
      }
    }, {
      key: "travelJSON",
      value: function travelJSON(obj) {
        if (typeof obj === 'string' && this.isDateString(obj)) {
          return new Date(obj);
        } else if (typeof obj === 'string') {
          return obj;
        }

        var stack = new Array();
        stack.push(obj);

        while (stack.length > 0) {
          var item = stack.pop();

          for (var key in item) {
            var value = item[key];
            if (value == null) continue;

            if (value instanceof Array) {
              for (var i = 0; i < value.length; i++) {
                stack.push(value[i]);
              }

              continue;
            }

            if (_typeof(value) == 'object') {
              stack.push(value);
              continue;
            }

            if (typeof value == 'string' && this.isDateString(value)) {
              item[key] = new Date(value);
            }
          }
        }

        return obj;
      }
    }, {
      key: "isDateString",
      value: function isDateString(text) {
        var datePattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
        var datePattern1 = /\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/;
        return text.match(datePattern) != null || text.match(datePattern1) != null;
      }
    }]);

    return Service;
  }(maishu_chitu_service_1.Service);

  Service.LoginInfoStorageName = 'app-login-info';
  Service.loginInfo = new maishu_chitu_service_1.ValueStore(Service.getStorageLoginInfo());
  exports.Service = Service;
});
