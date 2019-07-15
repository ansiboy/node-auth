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

define(["require", "exports", "react", "../item-page"], function (require, exports, React, item_page_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var DropdownField =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(DropdownField, _React$Component);

    function DropdownField(props) {
      var _this;

      _classCallCheck(this, DropdownField);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(DropdownField).call(this, props));
      _this.state = {
        items: []
      };
      return _this;
    }

    _createClass(DropdownField, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this2 = this;

        var _this$props = this.props,
            nameField = _this$props.nameField,
            valueField = _this$props.valueField;
        this.props.dataSource.select({}).then(function (r) {
          // let items = r.dataItems.map(o => ({ name: `${o[nameField]}`, value: `${o[valueField]}` }));
          _this2.setState({
            items: r.dataItems
          });
        });
        this.props.dataSource.inserted.add(function (sender, item) {
          var items = _this2.state.items;
          items.push(item);

          _this2.setState({
            items: items
          });
        });
      }
    }, {
      key: "render",
      value: function render() {
        var _this3 = this;

        var _this$props2 = this.props,
            dataField = _this$props2.dataField,
            label = _this$props2.label,
            name = _this$props2.name,
            placeholder = _this$props2.placeholder,
            itemStyle = _this$props2.itemStyle,
            nameField = _this$props2.nameField,
            valueField = _this$props2.valueField;
        var items = this.state.items;
        return React.createElement(item_page_1.ItemPageContext.Consumer, null, function (args) {
          var dataItem = args.dataItem || {};
          return React.createElement("div", {
            className: "input-control"
          }, React.createElement("label", null, label), React.createElement("span", null, React.createElement("select", {
            name: name || dataField,
            className: "form-control",
            ref: function ref(e) {
              if (!e) return;
              e.value = dataItem[dataField] || '';

              e.onchange = function () {
                dataItem[dataField] = e.value;

                if (_this3.props.onChange) {
                  _this3.props.onChange(e.value, dataItem);
                }

                args.updatePageState(dataItem);
              };
            }
          }, placeholder ? React.createElement("option", {
            value: ""
          }, placeholder) : null, items.map(function (o, i) {
            var style = itemStyle ? itemStyle(o) : {};
            return React.createElement("option", {
              key: i,
              value: "".concat(o[valueField]),
              style: style
            }, o[nameField]);
          }))));
        });
      }
    }]);

    return DropdownField;
  }(React.Component);

  exports.DropdownField = DropdownField;
});
