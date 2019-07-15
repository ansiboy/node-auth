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

define(["require", "exports", "assert/index", "assert/errors"], function (require, exports, index_1, errors_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function default_1(args) {
    var _this = this;

    var control;

    switch (args.resource.data.code) {
      case index_1.Buttons.codes.add:
        control = index_1.Buttons.createPageAddButton(function () {
          return __awaiter(_this, void 0, void 0,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    // itemDialog.show(args.dataItem);
                    alert("add totoken");

                  case 1:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));
        });
        break;

      default:
        throw errors_1.errors.unknonwResourceName(args.resource.data.code);
    }

    return control;
  }

  exports.default = default_1;
});
