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

define(["require", "exports", "react", "assert/index", "assert/dataSources", "assert/index", "maishu-dilu", "assert/index", "assert/errors", "maishu-ui-toolkit", "react-dom", "assert/index", "maishu-wuzhui", "assert/services/index", "error-handle"], function (require, exports, React, index_1, dataSources_1, index_2, maishu_dilu_1, index_3, errors_1, ui, ReactDOM, index_4, maishu_wuzhui_1, index_5, error_handle_1) {
  "use strict";

  var _this = this;

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var ps = new index_5.PermissionService(function (err) {
    return error_handle_1.default(err);
  });
  var menuItemDialog = index_4.createItemDialog(dataSources_1.dataSources.resource, "菜单", React.createElement(React.Fragment, null, React.createElement("div", {
    className: "form-group clearfix"
  }, React.createElement(index_2.TextInput, {
    dataField: "name",
    label: "\u540D\u79F0*",
    placeholder: "\u8BF7\u8F93\u5165\u540D\u79F0",
    validateRules: [maishu_dilu_1.rules.required("请输入名称")]
  })), React.createElement("div", {
    className: "form-group clearfix"
  }, React.createElement(index_1.DropdownField, {
    label: "所属菜单",
    dataField: "parent_id",
    nameField: "name",
    valueField: "id",
    placeholder: "\u8BF7\u9009\u62E9\u6240\u5C5E\u83DC\u5355",
    dataSource: new maishu_wuzhui_1.DataSource({
      select: function select() {
        return __awaiter(_this, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          var dataItems, menuItems;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return ps.resource.list();

                case 2:
                  dataItems = _context.sent;
                  menuItems = dataSources_1.translateToMenuItems(dataItems);
                  menuItems = menuItems.filter(function (o) {
                    return o.type == "menu" && o.parent == null;
                  }); // menuItems.forEach(o => {
                  //     if (o.parent == null) {
                  //         o.name = `|--- ${o.name}`
                  //     }
                  //     else if (o.parent.parent == null) {
                  //         o.name = `|------ ${o.name}`
                  //     }
                  // })

                  return _context.abrupt("return", {
                    dataItems: menuItems,
                    totalRowCount: menuItems.length
                  });

                case 6:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));
      }
    })
  })), React.createElement("div", {
    className: "form-group clearfix"
  }, React.createElement(index_2.TextInput, {
    dataField: "page_path",
    label: "\u8DEF\u5F84",
    placeholder: "\u8BF7\u8F93\u5165\u8DEF\u5F84"
  })), React.createElement("div", {
    className: "form-group clearfix"
  }, React.createElement(index_2.TextInput, {
    dataField: "icon",
    label: "\u56FE\u6807",
    placeholder: "\u8BF7\u8F93\u5165\u56FE\u6807"
  })), React.createElement("div", {
    className: "form-group clearfix"
  }, React.createElement(index_2.TextInput, {
    dataField: "sort_number",
    label: "\u5E8F\u53F7",
    placeholder: "\u7528\u4E8E\u6392\u5E8F"
  })), React.createElement("div", {
    className: "form-group clearfix"
  }, React.createElement(index_2.TextInput, {
    dataField: "remark",
    label: "\u5907\u6CE8",
    placeholder: "\u8BF7\u8F93\u5165\u5907\u6CE8"
  }))), function (dataItem) {
    return __awaiter(_this, void 0, void 0,
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              dataItem.type = "menu";

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
  });
  var controlResourceDialog = index_4.createItemDialog(dataSources_1.dataSources.resource, "菜单", React.createElement(React.Fragment, null, React.createElement("div", {
    className: "form-group clearfix"
  }, React.createElement(index_2.TextInput, {
    dataField: "name",
    label: "\u540D\u79F0*",
    placeholder: "\u8BF7\u8F93\u5165\u540D\u79F0",
    validateRules: [maishu_dilu_1.rules.required("请输入名称")]
  })), React.createElement("div", {
    className: "form-group clearfix"
  }, React.createElement(index_1.DropdownField, {
    label: "所属菜单",
    dataField: "parent_id",
    dataSource: dataSources_1.dataSources.resource,
    nameField: "name",
    valueField: "id",
    placeholder: "\u8BF7\u9009\u62E9\u6240\u5C5E\u83DC\u5355"
  })), React.createElement("div", {
    className: "form-group clearfix"
  }, React.createElement(index_2.TextInput, {
    dataField: "page_path",
    label: "\u8DEF\u5F84",
    placeholder: "\u8BF7\u8F93\u5165\u8DEF\u5F84"
  })), React.createElement("div", {
    className: "form-group clearfix"
  }, React.createElement(index_2.TextInput, {
    dataField: "sort_number",
    label: "\u5E8F\u53F7",
    placeholder: "\u7528\u4E8E\u6392\u5E8F"
  })), React.createElement("div", {
    className: "form-group clearfix"
  }, React.createElement(index_2.TextInput, {
    dataField: "remark",
    label: "\u5907\u6CE8",
    placeholder: "\u8BF7\u8F93\u5165\u5907\u6CE8"
  }))), function (dataItem) {
    return __awaiter(_this, void 0, void 0,
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              dataItem.type = "menu";

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
  });

  function showMenuDialog(dataItem) {
    // if (dataItem.type == "menu")
    menuItemDialog.show(dataItem); // else if (dataItem.type == "control")
    //     controlResourceDialog.show(dataItem);
  }

  function default_1(args) {
    var control;

    switch (args.resource.data.code) {
      case index_3.Buttons.codes.add:
        control = document.createElement("div");
        ReactDOM.render(React.createElement("button", {
          key: Math.random(),
          className: "btn btn-primary pull-right",
          onClick: function onClick() {
            return showMenuDialog({});
          }
        }, React.createElement("i", {
          className: "icon-plus"
        }), React.createElement("span", null, "\u6DFB\u52A0\u83DC\u5355")), control);
        break;

      case index_3.Buttons.codes.edit:
        control = index_3.Buttons.createListEditButton(function () {
          showMenuDialog(args.dataItem);
        });
        break;

      case index_3.Buttons.codes.remove:
        control = index_3.Buttons.createListDeleteButton(function () {
          ui.confirm({
            title: "提示",
            message: "\u786E\u5B9A\u5220\u9664\u83DC\u5355'".concat(args.dataItem.name, "'\u5417?"),
            confirm: function confirm() {
              return dataSources_1.dataSources.resource.delete(args.dataItem);
            }
          });
        });
        break;

      case index_3.Buttons.codes.view:
        control = index_3.Buttons.createListViewButton(function () {
          menuItemDialog.show(args.dataItem);
        });
        break;

      case "add_control":
      case "添加控件":
        control = document.createElement("div");
        ReactDOM.render(React.createElement("button", {
          key: Math.random(),
          className: "btn btn-primary pull-right",
          onClick: function onClick() {
            controlResourceDialog.show({});
          }
        }, React.createElement("i", {
          className: "icon-plus"
        }), React.createElement("span", null, "\u6DFB\u52A0\u63A7\u4EF6")), control);
        break;

      default:
        throw errors_1.errors.unknonwResourceName(args.resource.data.code);
    }

    return control;
  }

  exports.default = default_1;
});
