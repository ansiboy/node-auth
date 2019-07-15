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

define(["require", "exports", "react", "assert/index", "assert/index", "assert/dataSources", "maishu-wuzhui-helper", "maishu-ui-toolkit"], function (require, exports, React, index_1, index_2, dataSources_1, maishu_wuzhui_helper_1, maishu_ui_toolkit_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var TokenListPage =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(TokenListPage, _React$Component);

    function TokenListPage() {
      _classCallCheck(this, TokenListPage);

      return _possibleConstructorReturn(this, _getPrototypeOf(TokenListPage).apply(this, arguments));
    }

    _createClass(TokenListPage, [{
      key: "render",
      value: function render() {
        var _this = this;

        return React.createElement(React.Fragment, null, React.createElement(index_2.ListPage, {
          resourceId: this.props.data.resourceId,
          context: this,
          dataSource: dataSources_1.dataSources.token,
          columns: [maishu_wuzhui_helper_1.boundField({
            dataField: "id",
            headerText: "编号",
            headerStyle: {
              width: "300px"
            }
          }), maishu_wuzhui_helper_1.boundField({
            dataField: "content",
            headerText: "内容"
          }), index_1.dateTimeField({
            dataField: "create_date_time",
            headerText: "创建时间"
          })]
        }), React.createElement("div", {
          className: "modal fade",
          ref: function ref(e) {
            return _this.dialogElement = e || _this.dialogElement;
          }
        }, React.createElement("div", {
          className: "modal-dialog"
        }, React.createElement("div", {
          className: "modal-content"
        }, React.createElement("div", {
          className: "modal-header"
        }, React.createElement("button", {
          type: "button",
          className: "close",
          "data-dismiss": "modal"
        }, "\xD7"), React.createElement("h4", {
          className: "modal-title"
        }, "\u6DFB\u52A0")), React.createElement("div", {
          className: "modal-body"
        }, React.createElement("div", {
          className: "form-horizontal"
        }, React.createElement("div", {
          className: "form-group"
        }, React.createElement("label", {
          className: "col-sm-2 control-label"
        }, "\u7528\u6237\u540D"), React.createElement("div", {
          className: "col-sm-10"
        }, React.createElement("input", {
          type: "email",
          className: "form-control",
          id: "inputEmail3",
          placeholder: "\u8BF7\u8F93\u5165\u767B\u5F55\u7528\u6237\u7684\u624B\u673A\u53F7\u6216\u7528\u6237\u540D"
        }))))), React.createElement("div", {
          className: "modal-footer"
        }, React.createElement("button", {
          className: "btn btn-default",
          onClick: function onClick() {
            return maishu_ui_toolkit_1.hideDialog(_this.dialogElement);
          }
        }, React.createElement("i", {
          className: "icon-reply"
        }), React.createElement("span", null, "\u53D6\u6D88")), React.createElement("button", {
          className: "btn btn-primary"
        }, React.createElement("i", {
          className: "icon-save"
        }), React.createElement("span", null, "\u4FDD\u5B58")))))));
      }
    }]);

    return TokenListPage;
  }(React.Component);

  exports.default = TokenListPage;
});
