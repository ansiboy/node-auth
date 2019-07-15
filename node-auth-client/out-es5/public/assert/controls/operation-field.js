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

define(["require", "exports", "maishu-chitu", "assert/dataSources", "maishu-wuzhui-helper", "maishu-wuzhui", "./page-view"], function (require, exports, maishu_chitu_1, dataSources_1, maishu_wuzhui_helper_1, maishu_wuzhui_1, page_view_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function operationField(resourceId, permissionService, pageView, width) {
    width = width || '120px';
    var menuItemStorage = new maishu_chitu_1.ValueStore();
    permissionService.resource.list().then(function (resources) {
      var menuItems = dataSources_1.translateToMenuItems(resources);
      var currentMenuItem = menuItems.filter(function (o) {
        return o.id == resourceId;
      })[0];
      console.assert(currentMenuItem != null);
      menuItemStorage.value = currentMenuItem;
    });
    return maishu_wuzhui_helper_1.customField({
      headerText: '操作',
      itemStyle: {
        textAlign: 'center',
        width: width
      },
      headerStyle: {
        width: width
      },
      createItemCell: function createItemCell(dataItem) {
        var cell = new maishu_wuzhui_1.GridViewCell();
        renderCell(dataItem, cell);
        return cell;
      }
    });

    function renderCell(dataItem, cell) {
      return __awaiter(this, void 0, void 0,
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (menuItemStorage.value) {
                  renderOperationButtons(menuItemStorage.value, cell.element, dataItem, pageView);
                } else {
                  menuItemStorage.add(function (menuItem) {
                    renderOperationButtons(menuItem, cell.element, dataItem, pageView);
                  });
                }

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
    } // }

  }

  exports.operationField = operationField;

  function renderOperationButtons(menuItem, element, dataItem, pageView) {
    return __awaiter(this, void 0, void 0,
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var children, funcs, controlElements;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              children = menuItem.children || [];
              children.forEach(function (o) {
                return o.data = o.data || {};
              });
              children = children.filter(function (o) {
                return o.data.position == "in-list";
              });
              _context2.next = 5;
              return Promise.all(children.map(function (o) {
                return page_view_1.loadControlModule(o.page_path);
              }));

            case 5:
              funcs = _context2.sent;
              controlElements = children.map(function (o, i) {
                return funcs[i]({
                  resource: o,
                  dataItem: dataItem,
                  context: pageView
                });
              });
              controlElements.forEach(function (child) {
                element.appendChild(child);
              });

            case 8:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
  }

  exports.renderOperationButtons = renderOperationButtons;
});
