"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

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

define(["require", "exports", "react", "assert/index", "assert/index", "maishu-wuzhui-helper", "maishu-ui-toolkit", "assert/dataSources", "assert/services/index", "maishu-dilu"], function (require, exports, React, index_1, index_2, maishu_wuzhui_helper_1, ui, dataSources_1, index_3, maishu_dilu_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var UserListPage =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(UserListPage, _React$Component);

    function UserListPage(props) {
      var _this;

      _classCallCheck(this, UserListPage);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(UserListPage).call(this, props));
      _this.state = {
        activeIndex: 0
      };
      _this.ps = _this.props.createService(index_3.PermissionService);
      return _this;
    }

    _createClass(UserListPage, [{
      key: "active",
      value: function active(activeIndex) {
        return __awaiter(this, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          var args;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  args = {};
                  this.listPage.dataSource.select(args);
                  this.setState({
                    activeIndex: activeIndex
                  });

                case 3:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));
      }
    }, {
      key: "showAuthDialog",
      value: function showAuthDialog() {
        ui.showDialog(this.dialogElement);
      }
    }, {
      key: "search",
      value: function search(value) {
        return __awaiter(this, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee2() {
          var args;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  value = (value || '').trim();
                  args = this.listPage.gridView.selectArguments;
                  args.startRowIndex = 0;
                  args.filter = "mobile like '%".concat(value, "%'");
                  _context2.next = 6;
                  return this.listPage.dataSource.select(args);

                case 6:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));
      }
    }, {
      key: "showItem",
      value: function showItem(dataItem) {
        itemDialog.show(dataItem);
      }
    }, {
      key: "deleteItem",
      value: function deleteItem(dataItem) {
        var _this2 = this;

        ui.confirm({
          title: "请确认",
          message: "\u786E\u5B9A\u5220\u9664\u624B\u673A\u53F7\u4E3A'".concat(dataItem.mobile, "'\u7684\u7528\u6237\u5417"),
          confirm: function confirm() {
            return __awaiter(_this2, void 0, void 0,
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee3() {
              return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      return _context3.abrupt("return", dataSources_1.dataSources.user.delete(dataItem));

                    case 1:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3);
            }));
          }
        });
      }
    }, {
      key: "render",
      value: function render() {
        var _this3 = this;

        var person = this.state.person;
        return React.createElement(React.Fragment, null, React.createElement(index_2.ListPage, {
          resourceId: this.props.data.resourceId,
          ref: function ref(e) {
            return _this3.listPage = e || _this3.listPage;
          },
          context: {
            showItem: function showItem(dataItem) {
              return _this3.showItem(dataItem);
            },
            deleteItem: function deleteItem(dataItem) {
              return _this3.deleteItem(dataItem);
            }
          },
          dataSource: dataSources_1.dataSources.user,
          columns: [index_1.sortNumberField(), maishu_wuzhui_helper_1.boundField({
            headerText: '用户手机',
            dataField: 'mobile',
            headerStyle: {
              width: "180px"
            }
          }), maishu_wuzhui_helper_1.boundField({
            headerText: '用户名',
            dataField: 'user_name'
          }), maishu_wuzhui_helper_1.boundField({
            headerText: '邮箱',
            dataField: 'email'
          }), index_1.customDataField({
            headerText: "用户身份",
            render: function render(o) {
              return o.role ? o.role.name : "";
            }
          }), index_1.dateTimeField({
            dataField: 'lastest_login',
            headerText: '最后登录时间'
          }), index_1.dateTimeField({
            dataField: 'create_date_time',
            headerText: '创建时间'
          }), index_1.operationField(this.props.data.resourceId, this.ps, this, '160px')]
        }));
      }
    }]);

    return UserListPage;
  }(React.Component);

  exports.default = UserListPage;
  var itemDialog = index_2.createItemDialog(dataSources_1.dataSources.user, "用户", React.createElement(React.Fragment, null, React.createElement("div", {
    className: "form-group clearfix"
  }, React.createElement(index_1.TextInput, {
    dataField: "mobile",
    label: "\u624B\u673A\u53F7\u7801*",
    placeholder: "\u8BF7\u8F93\u5165\u624B\u673A\u53F7\u7801",
    validateRules: [maishu_dilu_1.rules.required("请输入手机号码")]
  })), React.createElement("div", {
    className: "form-group clearfix"
  }, React.createElement(index_1.TextInput, {
    dataField: "user_name",
    label: "\u7528\u6237\u540D",
    placeholder: "\u8BF7\u8F93\u5165\u7528\u6237\u540D"
  })), React.createElement("div", {
    className: "form-group clearfix"
  }, React.createElement(index_1.TextInput, {
    dataField: "email",
    label: "\u7535\u5B50\u90AE\u7BB1",
    placeholder: "\u8BF7\u8F93\u5165\u7535\u5B50\u90AE\u7BB1"
  })), React.createElement("div", {
    className: "form-group clearfix"
  }, React.createElement(index_1.TextInput, {
    dataField: "password",
    label: "\u5BC6\u7801*",
    placeholder: "\u8BF7\u8F93\u5165\u767B\u5F55\u5BC6\u7801",
    validateRules: [maishu_dilu_1.rules.required("请输入登录密码")]
  })), React.createElement("div", {
    className: "form-group clearfix"
  }, React.createElement(index_1.RadioListInput, {
    dataSource: dataSources_1.dataSources.role,
    nameField: "name",
    valueField: "id",
    label: "\u89D2\u8272",
    dataField: "role_id",
    dataType: "string",
    validateRules: [maishu_dilu_1.rules.required("请选择用户角色")]
  }))));
});
