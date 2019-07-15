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

define(["require", "exports", "maishu-wuzhui-helper", "maishu-wuzhui", "react-dom", "../list-page", "react"], function (require, exports, maishu_wuzhui_helper_1, maishu_wuzhui_1, ReactDOM, list_page_1, React) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function booleanSwitchField(args) {
    args.itemStyle = args.itemStyle || {};
    args.itemStyle.textAlign = args.itemStyle.textAlign || 'center';
    args.itemStyle.width = args.itemStyle.width || '100px';
    return maishu_wuzhui_helper_1.customField({
      headerText: args.headerText,
      itemStyle: args.itemStyle,
      headerStyle: args.headerStyle,
      createItemCell: function createItemCell() {
        var self = this;
        var cell = new maishu_wuzhui_1.GridViewDataCell({
          render: function render(dataItem, element) {
            var _this = this;

            ReactDOM.render(React.createElement(list_page_1.ListPageContext.Consumer, null, function (a) {
              if (a != null) {
                var dataSource = a.dataSource;
                console.log("dataSource ".concat(dataSource));
              }

              return React.createElement("label", {
                className: "switch"
              }, React.createElement("input", {
                type: "checkbox",
                className: "ace ace-switch ace-switch-5",
                ref: function ref(e) {
                  if (!e) return;
                  var value;

                  if (dataItem[args.dataField] == null && args.defaultValue != null) {
                    value = args.defaultValue;
                  } else {
                    value = dataItem[args.dataField];
                  }

                  e.checked = value == true;

                  e.onchange = function () {
                    return __awaiter(_this, void 0, void 0,
                    /*#__PURE__*/
                    regeneratorRuntime.mark(function _callee() {
                      var obj;
                      return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              console.assert(dataItem.id != null);
                              obj = {
                                id: dataItem.id
                              };
                              obj[args.dataField] = e.checked;
                              _context.next = 5;
                              return self.gridView.dataSource.executeUpdate(obj);

                            case 5:
                              dataItem[args.dataField] = e.checked;

                            case 6:
                            case "end":
                              return _context.stop();
                          }
                        }
                      }, _callee);
                    }));
                  };
                }
              }), React.createElement("span", {
                className: "lbl middle"
              }));
            }), element);
          }
        });
        return cell;
      }
    });
  }

  exports.booleanSwitchField = booleanSwitchField;
});
