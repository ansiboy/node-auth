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

define(["require", "exports", "maishu-chitu-react", "error-handle", "text!../content/admin_style_default.less"], function (require, exports, chitu_react, error_handle_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

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

      _this.error.add(function (sender, error, page) {
        return error_handle_1.default(error, sender, page);
      });

      return _this;
    }

    _createClass(Application, [{
      key: "createPageElement",
      value: function createPageElement(pageName, containerName) {
        var element = _get(_getPrototypeOf(Application.prototype), "createPageElement", this).call(this, pageName, containerName);

        var master = this.masterPages[containerName];
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
    }]);

    return Application;
  }(chitu_react.Application);

  exports.Application = Application; // let masterPages = {
  //     simple: null as MasterPage<any>,
  //     default: null as MainMasterPage
  // }
  // async function createMasterPages(app: Application): Promise<{ simple: HTMLElement, main: HTMLElement }> {
  //     return new Promise<{ simple: HTMLElement, main: HTMLElement }>((resolve, reject) => {
  //         let container = document.createElement('div')
  //         ReactDOM.render(<SimpleMasterPage app={app} ref={e => masterPages.simple = e || masterPages.simple} />, document.getElementById('simple-master'))
  //         ReactDOM.render(<MainMasterPage app={app} ref={e => masterPages.default = e || masterPages.default} />, document.getElementById('main-master'))
  //         document.body.appendChild(container)
  //         // let appService = app.createService(AppService)
  //         // if (app.userId) {
  //         //     appService.menuList().then(menuItems => {
  //         //         masterPages.default.setMenus(menuItems)
  //         //     })
  //         // }
  //     })
  // }

  exports.app = new Application(document.getElementById('simple-master'), document.getElementById('main-master'));
}); // createMasterPages(app)
