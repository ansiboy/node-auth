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

define(["require", "exports", "maishu-services-sdk", "maishu-chitu-react", "./_config", "react", "react-dom", "./masters/main-master-page", "./masters/simple-master-page", "./_service", "text!../content/admin_style_default.less"], function (require, exports, maishu_services_sdk_1, chitu_react, _config_1, React, ReactDOM, main_master_page_1, simple_master_page_1, _service_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  _config_1.config.login = _config_1.config.login || {};
  _config_1.config.login.showForgetPassword = true;
  _config_1.config.login.showRegister = true;
  _config_1.config.firstPanelWidth = "130px";
  _config_1.config.login.title = "好易微商城";
  maishu_services_sdk_1.PermissionService.baseUrl = "http://127.0.0.1:2857";

  var Application =
  /*#__PURE__*/
  function (_chitu_react$Applicat) {
    _inherits(Application, _chitu_react$Applicat);

    function Application(simpleContainer, mainContainer) {
      var _this;

      _classCallCheck(this, Application);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Application).call(this, {
        container: {
          simple: simpleContainer,
          default: mainContainer
        }
      }));
      _this.pageMasters = {};
      _this.masterPages = {};
      _this.masterElements = {};

      _this.error.add(function (sender, error) {
        debugger;
      });

      return _this;
    }

    _createClass(Application, [{
      key: "createPageElement",
      value: function createPageElement(pageName, containerName) {
        var element = _get(_getPrototypeOf(Application.prototype), "createPageElement", this).call(this, pageName, containerName);

        var master = masterPages[containerName];
        console.assert(master != null);
        master.pageContainer.appendChild(element);
        return element;
      }
    }, {
      key: "showPage",
      value: function showPage(pageUrl, args, forceRender) {
        args = args || {};
        var d = this.parseUrl(pageUrl);
        var names = ['login', 'forget-password', 'register'];

        if (names.indexOf(d.pageName) >= 0) {
          args.container = 'simple';
        }

        return _get(_getPrototypeOf(Application.prototype), "showPage", this).call(this, pageUrl, args, forceRender);
      }
    }, {
      key: "logout",
      value: function logout() {
        var s = this.createService(maishu_services_sdk_1.UserService);
        s.logout();

        if (_config_1.config.logoutRedirectURL) {
          location.href = _config_1.config.logoutRedirectURL;
        }
      } // protected defaultPageNodeParser() {
      //     let nodes: { [key: string]: chitu.PageNode } = {}
      //     let p: chitu.PageNodeParser = {
      //         actions: {},
      //         parse: (pageName) => {
      //             let node = nodes[pageName];
      //             if (node == null) {
      //                 let path = `modules/${pageName}`;
      //                 node = { action: this.createDefaultAction(path, this.loadjs), name: pageName };
      //                 nodes[pageName] = node;
      //             }
      //             return node;
      //         }
      //     }
      //     return p
      // }

      /** 加载样式文件 */

    }, {
      key: "loadStyle",
      value: function loadStyle() {
        var str = require('text!../content/admin_style_default.less');

        if (this.config.firstPanelWidth) {
          str = str + "\r\n@firstPanelWidth: ".concat(this.config.firstPanelWidth, ";");
        }

        if (this.config.secondPanelWidth) {
          str = str + "\r\n@secondPanelWidth: ".concat(this.config.secondPanelWidth, ";");
        }

        var less = window['less'];
        less.render(str, function (e, result) {
          if (e) {
            console.error(e);
            return;
          }

          var style = document.createElement('style');
          document.head.appendChild(style);
          style.innerText = result.css;
        });
      }
    }, {
      key: "run",
      value: function run() {
        _get(_getPrototypeOf(Application.prototype), "run", this).call(this);

        this.loadStyle();
      }
    }, {
      key: "userId",
      get: function get() {
        if (maishu_services_sdk_1.Service.loginInfo.value == null) return null;
        return maishu_services_sdk_1.Service.loginInfo.value.userId;
      }
    }, {
      key: "token",
      get: function get() {
        if (maishu_services_sdk_1.Service.loginInfo.value == null) return null;
        return maishu_services_sdk_1.Service.loginInfo.value.token;
      }
    }, {
      key: "config",
      get: function get() {
        return _config_1.config;
      }
    }]);

    return Application;
  }(chitu_react.Application);

  exports.Application = Application;
  var masterPages = {
    simple: null,
    default: null
  };

  function createMasterPages(app) {
    return __awaiter(this, void 0, void 0,
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", new Promise(function (resolve, reject) {
                var container = document.createElement('div');
                ReactDOM.render(React.createElement(simple_master_page_1.SimpleMasterPage, {
                  app: app,
                  ref: function ref(e) {
                    return masterPages.simple = e || masterPages.simple;
                  }
                }), document.getElementById('simple-master'));
                ReactDOM.render(React.createElement(main_master_page_1.MainMasterPage, {
                  app: app,
                  ref: function ref(e) {
                    return masterPages.default = e || masterPages.default;
                  }
                }), document.getElementById('main-master'));
                document.body.appendChild(container);
                var appService = app.createService(_service_1.AppService);

                if (app.userId) {
                  appService.menuList(app.userId).then(function (menuItems) {
                    masterPages.default.setMenus(menuItems);
                  });
                }
              }));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
  }

  exports.app = new Application(document.getElementById('simple-master'), document.getElementById('main-master'));
  createMasterPages(exports.app);
});
