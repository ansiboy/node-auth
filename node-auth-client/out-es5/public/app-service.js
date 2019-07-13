"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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

define(["require", "exports", "maishu-chitu-service", "_errors"], function (require, exports, maishu_chitu_service_1, _errors_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var AppService =
  /*#__PURE__*/
  function (_maishu_chitu_service) {
    _inherits(AppService, _maishu_chitu_service);

    function AppService() {
      _classCallCheck(this, AppService);

      return _possibleConstructorReturn(this, _getPrototypeOf(AppService).apply(this, arguments));
    }

    _createClass(AppService, [{
      key: "ajax",
      value: function ajax(url, options) {
        options = options || {};
        options.headers = options.headers || {};
        console.assert(AppService.loginInfo != null);
        if (AppService.loginInfo.value) options.headers["token"] = AppService.loginInfo.value.token;
        return _get(_getPrototypeOf(AppService.prototype), "ajax", this).call(this, url, options);
      }
    }, {
      key: "menuList",
      value: function menuList(userId) {
        return __awaiter(this, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          var items, arr, stack, item, _loop, i;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.get('auth/menu/list', {
                    userId: userId
                  });

                case 2:
                  items = _context.sent;
                  arr = new Array();
                  stack = _toConsumableArray(items);

                  while (stack.length > 0) {
                    item = stack.pop();
                    arr.push(item);
                    (item.children || []).forEach(function (o) {
                      arr.push(o);
                    });
                  }

                  _loop = function _loop(i) {
                    if (arr[i].parentId) {
                      arr[i].parent = arr.filter(function (o) {
                        return o.id == arr[i].parentId;
                      })[0];
                    }
                  };

                  for (i = 0; i < arr.length; i++) {
                    _loop(i);
                  }

                  return _context.abrupt("return", items);

                case 9:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));
      }
    }, {
      key: "login",
      value: function login(username, password) {
        return __awaiter(this, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee2() {
          var r;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return this.post("auth/user/login", {
                    username: username,
                    password: password
                  });

                case 2:
                  r = _context2.sent;

                  if (!(r == null)) {
                    _context2.next = 5;
                    break;
                  }

                  throw _errors_1.errors.unexpectedNullResult();

                case 5:
                  AppService.loginInfo.value = r;
                  AppService.setStorageLoginInfo(r);

                case 7:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));
      }
    }], [{
      key: "setStorageLoginInfo",
      value: function setStorageLoginInfo(value) {
        if (value == null) {
          this.removeCookie(AppService.LoginInfoStorageName);
          return;
        }

        this.setCookie(AppService.LoginInfoStorageName, JSON.stringify(value), 1000);
      }
    }, {
      key: "getStorageLoginInfo",
      value: function getStorageLoginInfo() {
        var loginInfoSerialString = this.getCookie(AppService.LoginInfoStorageName);
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
      key: "removeCookie",
      value: function removeCookie(name) {
        // document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        this.setCookie(name, '');
      }
    }, {
      key: "setCookie",
      value: function setCookie(name, value, days) {
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
    }]);

    return AppService;
  }(maishu_chitu_service_1.Service);

  AppService.loginInfo = new maishu_chitu_service_1.ValueStore(AppService.getStorageLoginInfo());
  AppService.LoginInfoStorageName = 'app-login-info';
  exports.AppService = AppService;
});
