"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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

define(["require", "exports", "react", "maishu-ui-toolkit", "react-dom", "./item-page", "maishu-dilu"], function (require, exports, React, maishu_ui_toolkit_1, ReactDOM, item_page_1, maishu_dilu_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function createItemDialog(dataSource, name, child, beforeSave) {
    var ItemDialog =
    /*#__PURE__*/
    function (_React$Component) {
      _inherits(ItemDialog, _React$Component);

      function ItemDialog(props) {
        var _this;

        _classCallCheck(this, ItemDialog);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(ItemDialog).call(this, props));
        _this.state = {
          dataItem: props.dataItem
        };
        _this.beforeSaves = [];
        return _this;
      }

      _createClass(ItemDialog, [{
        key: "onSaveButtonClick",
        value: function onSaveButtonClick(dataItem) {
          return __awaiter(this, void 0, void 0,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    this.validator.clearErrors();

                    if (this.validator.check()) {
                      _context.next = 3;
                      break;
                    }

                    return _context.abrupt("return", Promise.reject('validate fail'));

                  case 3:
                    _context.next = 5;
                    return this.save(dataItem);

                  case 5:
                    maishu_ui_toolkit_1.hideDialog(this.dialogElement);

                  case 6:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));
        }
      }, {
        key: "save",
        value: function save(dataItem) {
          return __awaiter(this, void 0, void 0,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee2() {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!beforeSave) {
                      _context2.next = 3;
                      break;
                    }

                    _context2.next = 3;
                    return beforeSave(dataItem);

                  case 3:
                    if (!(this.beforeSaves.length > 0)) {
                      _context2.next = 6;
                      break;
                    }

                    _context2.next = 6;
                    return Promise.all(this.beforeSaves.map(function (m) {
                      return m(dataItem);
                    }));

                  case 6:
                    if (!dataItem.id) {
                      _context2.next = 11;
                      break;
                    }

                    _context2.next = 9;
                    return dataSource.update(dataItem);

                  case 9:
                    _context2.next = 13;
                    break;

                  case 11:
                    _context2.next = 13;
                    return dataSource.insert(dataItem);

                  case 13:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));
        }
      }, {
        key: "childrenToArray",
        value: function childrenToArray(children) {
          var r = Array.isArray(children) ? children : [children];
          r = r.filter(function (o) {
            return o;
          });
          return r;
        }
      }, {
        key: "componentDidMount",
        value: function componentDidMount() {
          var nodes = this.childrenToArray(child.props.children); //Array.isArray(child.props.children) ? child.props.children : [child.props.children];

          var validateFields = [];

          var stack = _toConsumableArray(nodes);

          while (stack.length > 0) {
            var item = stack.pop();
            if (!item.props) continue;
            var props = item.props;

            if (props.validateRules != null) {
              var f = {
                name: props.name || props.dataField,
                rules: props.validateRules || []
              };
              validateFields.push(f);
            }

            var children = this.childrenToArray(item.props.children);
            stack.push.apply(stack, _toConsumableArray(children));
          }

          this.validator = _construct(maishu_dilu_1.FormValidator, [this.fieldsConatiner].concat(validateFields));
        }
      }, {
        key: "render",
        value: function render() {
          var _this2 = this;

          var dataItem = this.state.dataItem;
          return React.createElement("div", {
            className: "modal-dialog"
          }, React.createElement("div", {
            className: "modal-content"
          }, React.createElement("div", {
            className: "modal-header"
          }, React.createElement("button", {
            type: "button",
            className: "close",
            "data-dismiss": "modal",
            "aria-label": "Close"
          }, React.createElement("span", {
            "aria-hidden": "true"
          }, "\xD7")), React.createElement("h4", {
            className: "modal-title"
          }, dataItem.id ? "\u4FEE\u6539".concat(name) : "\u6DFB\u52A0".concat(name))), React.createElement("div", {
            className: "modal-body well",
            style: {
              paddingLeft: 20,
              paddingRight: 20
            },
            ref: function ref(e) {
              return _this2.fieldsConatiner = e || _this2.fieldsConatiner;
            }
          }, React.createElement(item_page_1.ItemPageContext.Provider, {
            value: {
              dataItem: dataItem,
              updatePageState: function updatePageState(dataItem) {
                _this2.setState({
                  dataItem: dataItem
                });
              },
              beforeSave: function beforeSave(callback) {
                _this2.beforeSaves.push(callback);
              }
            }
          }, child)), React.createElement("div", {
            className: "modal-footer"
          }, React.createElement("button", {
            className: "btn btn-default",
            onClick: function onClick(e) {
              maishu_ui_toolkit_1.hideDialog(_this2.dialogElement);
            }
          }, React.createElement("i", {
            className: "icon-reply"
          }), React.createElement("span", null, "\u53D6\u6D88")), React.createElement("button", {
            className: "btn btn-primary",
            onClick: function onClick() {
              return _this2.onSaveButtonClick(dataItem);
            }
          }, React.createElement("i", {
            className: "icon-save"
          }), React.createElement("span", null, "\u786E\u5B9A")))));
        }
      }], [{
        key: "show",
        value: function show(dataItem) {
          if (!ItemDialog.instance) {
            var dialogElement = document.createElement("div");
            dialogElement.className = "modal fade-in";
            document.body.appendChild(dialogElement);
            ItemDialog.instance = ReactDOM.render(React.createElement(ItemDialog, {
              dataItem: dataItem
            }), dialogElement);
            ItemDialog.instance.dialogElement = dialogElement;
          }

          ItemDialog.instance.validator.clearErrors();
          ItemDialog.instance.setState({
            dataItem: dataItem
          });
          maishu_ui_toolkit_1.showDialog(ItemDialog.instance.dialogElement);
        }
      }]);

      return ItemDialog;
    }(React.Component);

    return ItemDialog;
  }

  exports.createItemDialog = createItemDialog;
});
