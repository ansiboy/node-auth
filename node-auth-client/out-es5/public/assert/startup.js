"use strict";

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

define(["require", "exports", "./application", "react-dom", "./masters/simple-master-page", "./masters/main-master-page", "react", "./services/index", "../config", "./errors"], function (require, exports, application_1, ReactDOM, simple_master_page_1, main_master_page_1, React, index_1, config_1, errors_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  index_1.PermissionService.baseUrl = config_1.config.permissionServiceUrl;
  if (!config_1.config.permissionServiceUrl) throw errors_1.errors.serviceUrlCanntNull("permissionService");

  function startup() {
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
                }));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
    }

    var masterPages = {
      simple: null,
      default: null
    };
    createMasterPages(application_1.app);
    loadStyle();
    application_1.app.masterPages = masterPages;
    application_1.app.run();
  }

  exports.default = startup;
  /** 加载样式文件 */

  function loadStyle() {
    var str = require('text!../content/admin_style_default.less');

    if (config_1.config.firstPanelWidth) {
      str = str + "\r\n@firstPanelWidth: ".concat(config_1.config.firstPanelWidth, "px;");
    }

    if (config_1.config.secondPanelWidth) {
      str = str + "\r\n@secondPanelWidth: ".concat(config_1.config.secondPanelWidth, "px;");
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
});
