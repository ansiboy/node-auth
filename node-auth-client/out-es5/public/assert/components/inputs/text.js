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

define(["require", "exports", "react", "../index"], function (require, exports, React, index_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var TextInput =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(TextInput, _React$Component);

    function TextInput(props) {
      var _this;

      _classCallCheck(this, TextInput);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(TextInput).call(this, props));
      _this.state = {
        dataItem: {}
      };
      return _this;
    }

    _createClass(TextInput, [{
      key: "render",
      value: function render() {
        var _this2 = this;

        var _this$props = this.props,
            dataField = _this$props.dataField,
            label = _this$props.label,
            name = _this$props.name,
            placeholder = _this$props.placeholder;
        return React.createElement(index_1.ItemPageContext.Consumer, null, function (args) {
          var dataItem = args.dataItem || {};
          return React.createElement("div", {
            className: "input-control"
          }, React.createElement("label", null, label), React.createElement("span", null, React.createElement("input", {
            name: name || dataField,
            className: "form-control",
            placeholder: placeholder,
            type: _this2.props.type,
            ref: function ref(e) {
              if (!e) return;
              _this2.input = e;
              e.value = dataItem[dataField] || '';

              e.onchange = function () {
                dataItem[dataField] = e.value;
              };
            }
          })));
        });
      }
    }, {
      key: "value",
      get: function get() {
        return this.input.value;
      }
    }]);

    return TextInput;
  }(React.Component);

  exports.TextInput = TextInput;

  function textbox(args) {
    var element = args.element,
        dataField = args.dataField,
        name = args.name,
        dataItem = args.dataItem;
    element.name = name || dataField;

    var convertToValue = args.toInputValue || function (fieldValue) {
      if (!fieldValue) return "";
      return "".concat(fieldValue);
    };

    var convertFromValue = args.fromInputValue || function (value) {
      if (!value) return null;
      return value;
    };

    element.value = convertToValue(dataItem[dataField]);

    element.onchange = function () {
      dataItem[dataField] = convertFromValue(element.value);
    };
  }

  exports.textbox = textbox;
});
