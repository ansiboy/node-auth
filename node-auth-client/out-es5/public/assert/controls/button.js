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

define(["require", "exports", "./errors", "maishu-ui-toolkit", "assert/application"], function (require, exports, errors_1, maishu_ui_toolkit_1, application_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function default_1(args) {
    var _this = this;

    //TODO: 检查参数
    var buttonInfo = args.resource.data.button;
    if (buttonInfo == null) throw errors_1.errors.resourceDataFieldMissing(args.resource, "button");
    var button = document.createElement("button");
    button.className = buttonInfo.className;
    var html = "";

    if (args.resource.icon) {
      html = html + "<i class=\"".concat(args.resource.icon, "\"></i>");
    }

    if (buttonInfo.showButtonText) {
      html = html + "<span>".concat(args.resource.name, "</span>");
    }

    button.innerHTML = html;
    maishu_ui_toolkit_1.buttonOnClick(button, function () {
      return __awaiter(_this, void 0, void 0,
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var executePath, methodName, data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                executePath = buttonInfo.execute_path;

                if (executePath) {
                  _context.next = 3;
                  break;
                }

                throw errors_1.errors.buttonExecutePahtIsEmpty(args.resource);

              case 3:
                if (!executePath.startsWith("func:")) {
                  _context.next = 18;
                  break;
                }

                methodName = executePath.substring("func:".length);

                if (methodName) {
                  _context.next = 7;
                  break;
                }

                throw errors_1.errors.executePathIncorrect(executePath);

              case 7:
                console.assert(args.context != null);

                if (!(args.context == null)) {
                  _context.next = 10;
                  break;
                }

                throw errors_1.errors.contextIsNull();

              case 10:
                if (args.context[methodName]) {
                  _context.next = 12;
                  break;
                }

                throw errors_1.errors.contextMemberIsNotExist(methodName);

              case 12:
                if (!(typeof args.context[methodName] != "function")) {
                  _context.next = 14;
                  break;
                }

                throw errors_1.errors.contextMemberIsNotFunction(methodName);

              case 14:
                _context.next = 16;
                return args.context[methodName](args.dataItem);

              case 16:
                _context.next = 25;
                break;

              case 18:
                if (!executePath.startsWith("#")) {
                  _context.next = 24;
                  break;
                }

                data = {
                  resourceId: args.resource.id
                };
                if (args.dataItem.id) data["dataItemId"] = args.dataItem.id;
                application_1.app.redirect(executePath.substring(1), data);
                _context.next = 25;
                break;

              case 24:
                throw errors_1.errors.executePathIncorrect(executePath);

              case 25:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
    }, {
      toast: buttonInfo.toast
    });
    return button;
  }

  exports.default = default_1;
});
