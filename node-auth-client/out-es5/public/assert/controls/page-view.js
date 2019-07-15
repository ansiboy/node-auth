"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

define(["require", "exports", "./errors"], function (require, exports, errors_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var PageView =
  /*#__PURE__*/
  function () {
    function PageView(args) {
      var _this = this;

      _classCallCheck(this, PageView);

      this.args = args;
      var resource = args.menuItems.filter(function (o) {
        return o.id == args.resourceId;
      })[0];
      console.assert(resource != null);
      this.initElement(args, resource); // this.createBody(args);

      if (args.showBackButton) this.showBackButton();
      this.loadTopControls(args).then(function (controls) {
        controls.reverse();
        controls.map(function (ctrl) {
          var li = document.createElement("li");
          li.className = "pull-right";
          li.appendChild(ctrl);
          return li;
        }).forEach(function (li) {
          _this.navBar.appendChild(li);
        });
      });
    } // private createBody(args: PageViewArguments) {
    //     let body = document.createElement("div");
    //     args.element.appendChild(body);
    //     this.render(body);
    //     return body;
    // }


    _createClass(PageView, [{
      key: "showBackButton",
      value: function showBackButton() {
        this.backButton.style.removeProperty("display");
      }
    }, {
      key: "initElement",
      value: function initElement(args, menuItem) {
        var element = args.element;
        element.innerHTML = "\n        <div class=\"tabbable\">\n            <ul class=\"nav nav-tabs\" style=\"min-height:34\">\n                <li className=\"pull-left\">\n                    <div style=\"font-weight: bold; font-size: 16px\">".concat(menuItem.name, "</div>\n                </li>\n                <li class=\"pull-right\">\n                    <button class=\"btn btn-primary pull-right\" style=\"display:none;\">\n                        <i class=\"icon-reply\"></i>\n                        <span>\u8FD4\u56DE</span>\n                    </button>\n                </li>\n            </ul>\n        </div>\n        ");
        this.backButton = element.querySelector("button");

        this.backButton.onclick = function () {
          return history.back();
        };

        this.navBar = args.element.querySelector("ul");
      } // protected render(element: HTMLElement) {
      //     if (this.args.render)
      //         this.args.render(element);
      // }

    }, {
      key: "loadTopControls",
      value: function loadTopControls(args) {
        return __awaiter(this, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          var resource_id, resources, menuItem, menuItemChildren, controlResources, controlFuns, controls;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  resource_id = args.resourceId;

                  if (resource_id) {
                    _context.next = 3;
                    break;
                  }

                  return _context.abrupt("return", null);

                case 3:
                  resources = args.menuItems;
                  menuItem = resources.filter(function (o) {
                    return o.id == resource_id;
                  })[0];
                  console.assert(menuItem != null);
                  menuItemChildren = resources.filter(function (o) {
                    return o.parent_id == menuItem.id;
                  });
                  controlResources = menuItemChildren.filter(function (o) {
                    return o.data != null && o.data.position == "top-right";
                  });
                  _context.next = 10;
                  return Promise.all(controlResources.map(function (o) {
                    return loadControlModule(o.page_path);
                  }));

                case 10:
                  controlFuns = _context.sent;
                  controls = controlFuns.map(function (func, i) {
                    return func({
                      resource: controlResources[i],
                      dataItem: {},
                      context: args.context
                    });
                  });
                  return _context.abrupt("return", controls);

                case 13:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));
      }
    }]);

    return PageView;
  }();

  exports.PageView = PageView;

  function loadControlModule(path) {
    if (path.endsWith(".js")) path = path.substr(0, path.length - 3);
    return new Promise(function (resolve, reject) {
      requirejs([path], function (mod) {
        if (mod == null) throw errors_1.errors.moduleIsNull(path);
        var defaultExport = mod["default"];
        if (!defaultExport) throw errors_1.errors.moduleHasNoneDefaultExports(path);
        if (typeof defaultExport != 'function') throw errors_1.errors.moduleHasDefaultExportIsNotFunction(path); // defaultExport(args);

        resolve(defaultExport);
      }, function (err) {
        var msg = "Load module ".concat(path, " fail.");
        var error = new Error(msg);
        error["innerError"] = err;
        reject(error);
        console.log(error);
      });
    });
  }

  exports.loadControlModule = loadControlModule;
});
