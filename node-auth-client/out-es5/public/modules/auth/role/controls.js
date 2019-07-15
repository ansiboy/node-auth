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

define(["require", "exports", "react", "assert/index", "maishu-dilu", "assert/errors", "assert/application", "maishu-ui-toolkit", "assert/dataSources"], function (require, exports, React, index_1, maishu_dilu_1, errors_1, application_1, ui, dataSources_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var itemDialog = index_1.createItemDialog(dataSources_1.dataSources.role, "角色", React.createElement(React.Fragment, null, React.createElement("div", {
    className: "form-group clearfix"
  }, React.createElement(index_1.TextInput, {
    dataField: "name",
    label: "\u540D\u79F0*",
    placeholder: "\u8BF7\u8F93\u5165\u89D2\u8272\u540D\u79F0",
    validateRules: [maishu_dilu_1.rules.required("请输入角色名称")]
  })), React.createElement("div", {
    className: "form-group clearfix"
  }, React.createElement(index_1.TextInput, {
    dataField: "remark",
    label: "\u5907\u6CE8",
    placeholder: "\u8BF7\u8F93\u5165\u5907\u6CE8"
  }))));

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
                    itemDialog.show({});

                  case 1:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));
        });
        break;

      case index_1.Buttons.codes.edit:
        control = index_1.Buttons.createListEditButton(function () {
          itemDialog.show(args.dataItem);
        });
        break;

      case index_1.Buttons.codes.remove:
        control = index_1.Buttons.createListDeleteButton(function () {
          ui.confirm({
            title: "提示",
            message: "\u786E\u5B9A\u5220\u9664\u89D2\u8272'".concat(args.dataItem.name, "'\u5417?"),
            confirm: function confirm() {
              return dataSources_1.dataSources.role.delete(args.dataItem);
            }
          });
        });
        break;

      case index_1.Buttons.codes.view:
        control = index_1.Buttons.createListViewButton(function () {
          itemDialog.show(args.dataItem);
        });
        break;

      case "role_permission":
        control = document.createElement("button");
        control.className = "btn btn-minier btn-default";
        control.innerHTML = "<span>权限设置</span>";

        control.onclick = function () {
          var data = {
            resourceId: args.resource.id,
            dataItemId: args.dataItem.id
          };
          application_1.app.redirect("auth/permission/list", data);
        };

        break;

      default:
        throw errors_1.errors.unknonwResourceName(args.resource.data.code);
    }

    return control;
  }

  exports.default = default_1;
});
