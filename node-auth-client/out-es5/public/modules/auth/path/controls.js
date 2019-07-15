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

define(["require", "exports", "assert/index", "react", "maishu-dilu", "assert/errors", "maishu-wuzhui-helper", "assert/dataSources"], function (require, exports, index_1, React, maishu_dilu_1, errors_1, maishu_wuzhui_helper_1, dataSources_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var itemDialog = index_1.createItemDialog(dataSources_1.dataSources.module, "路径", React.createElement(index_1.ItemPageContext.Consumer, null, function (args) {
    var dataItem = args.dataItem;
    var name = dataItem.name;
    var p = dataItem.parent;

    while (p) {
      name = p.name + " " + name;
      p = p.parent;
    }

    return React.createElement(React.Fragment, null, React.createElement("div", {
      className: "form-group clearfix"
    }, React.createElement(PathList, {
      dataItem: dataItem
    })));
  }));

  var PathList =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(PathList, _React$Component);

    function PathList(props) {
      var _this;

      _classCallCheck(this, PathList);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(PathList).call(this, props));
      _this.newItem = {};
      _this.state = {
        dataItem: props.dataItem
      };
      return _this;
    }

    _createClass(PathList, [{
      key: "addItem",
      value: function addItem() {
        if (!this.validator.check()) return;
        this.state.dataItem.paths.push(this.newItem);
        this.setState({
          dataItem: this.state.dataItem
        });
        this.newItem = {};
      }
    }, {
      key: "removeItem",
      value: function removeItem(path) {
        this.state.dataItem.paths = this.state.dataItem.paths.filter(function (o) {
          return o.id != path.id;
        });
        this.setState({
          dataItem: this.state.dataItem
        });
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        this.validator = new maishu_dilu_1.FormValidator(this.formElement, {
          name: "path",
          rules: [maishu_dilu_1.rules.required("请输入路径")]
        });
      }
    }, {
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(props) {
        this.setState({
          dataItem: props.dataItem
        });
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        var dataItem = this.state.dataItem;
        return React.createElement("table", {
          style: {
            marginBottom: 0
          },
          className: "table table-striped table-bordered"
        }, React.createElement("tbody", null, dataItem.paths.map(function (p, i) {
          return React.createElement("tr", {
            key: i
          }, React.createElement("td", null, React.createElement("input", {
            className: "form-control",
            ref: function ref(e) {
              if (!e) return;
              maishu_wuzhui_helper_1.textbox({
                element: e,
                dataField: "value",
                dataItem: p,
                valueType: "string"
              });
            }
          })), React.createElement("td", {
            style: {
              textAlign: "center",
              width: "50px"
            }
          }, React.createElement("button", {
            className: "btn btn-danger",
            onClick: function onClick() {
              return _this2.removeItem(p);
            }
          }, React.createElement("i", {
            className: "icon-trash",
            style: {
              marginRight: 4
            }
          }), React.createElement("span", null, "\u5220\u9664"))));
        })), React.createElement("tfoot", {
          ref: function ref(e) {
            return _this2.formElement = _this2.formElement || e;
          }
        }, React.createElement("tr", null, React.createElement("td", null, React.createElement("input", {
          name: "path",
          className: "form-control",
          placeholder: "\u8BF7\u8F93\u5165\u8BE5\u6A21\u5757\u5141\u8BB8\u8BBF\u95EE\u7684\u8DEF\u5F84",
          ref: function ref(e) {
            return e ? maishu_wuzhui_helper_1.textbox({
              element: e,
              dataField: "value",
              dataItem: _this2.newItem,
              valueType: "string"
            }) : null;
          }
        })), React.createElement("td", {
          style: {
            textAlign: "center",
            width: "50px"
          }
        }, React.createElement("button", {
          className: "btn btn-info",
          onClick: function onClick() {
            return _this2.addItem();
          }
        }, React.createElement("i", {
          className: "icon-plus",
          style: {
            marginRight: 4
          }
        }), React.createElement("span", null, "\u6DFB\u52A0"))))));
      }
    }]);

    return PathList;
  }(React.Component);

  function default_1(args) {
    var _this3 = this;

    var control;

    switch (args.resource.data.code) {
      case index_1.Buttons.codes.add:
        control = index_1.Buttons.createPageAddButton(function () {
          return __awaiter(_this3, void 0, void 0,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    itemDialog.show(args.dataItem);

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

      case index_1.Buttons.codes.view:
        control = index_1.Buttons.createListViewButton(function () {
          itemDialog.show(args.dataItem);
        });
        break;

      default:
        throw errors_1.errors.unknonwResourceName(args.resource.name);
    }

    return control;
  }

  exports.default = default_1;
});
