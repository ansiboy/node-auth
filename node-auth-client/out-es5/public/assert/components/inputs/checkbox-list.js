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

define(["require", "exports", "react", "../item-page", "maishu-wuzhui-helper"], function (require, exports, React, item_page_1, maishu_wuzhui_helper_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var CheckboxListInput =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(CheckboxListInput, _React$Component);

    function CheckboxListInput(props) {
      var _this;

      _classCallCheck(this, CheckboxListInput);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(CheckboxListInput).call(this, props));
      _this.state = {};
      return _this;
    }

    _createClass(CheckboxListInput, [{
      key: "render",
      value: function render() {
        var _this2 = this;

        var _this$props = this.props,
            dataField = _this$props.dataField,
            label = _this$props.label,
            dataSource = _this$props.dataSource,
            nameField = _this$props.nameField,
            valueField = _this$props.valueField;
        return React.createElement(item_page_1.ItemPageContext.Consumer, null, function (args) {
          var dataItem = args.dataItem || {};
          dataItem[dataField] = dataItem[dataField] || _this2.props.defaultValue;
          return React.createElement("div", {
            className: "item"
          }, React.createElement("label", null, label), React.createElement("span", null, React.createElement("div", {
            ref: function ref(e) {
              if (!e) return;
              maishu_wuzhui_helper_1.checkboxList({
                element: e,
                dataSource: dataSource,
                dataField: dataField,
                nameField: nameField,
                valueField: valueField,
                dataItem: dataItem
              });
            }
          }), React.createElement("div", {
            className: "validationMessage ".concat(dataField),
            style: {
              display: "none"
            }
          }, "\u8BF7\u9009\u62E9\u7528\u6237\u89D2\u8272")));
        });
      }
    }]);

    return CheckboxListInput;
  }(React.Component);

  exports.CheckboxListInput = CheckboxListInput;
});
