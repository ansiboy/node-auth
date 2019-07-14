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

define(["require", "exports", "react", "../forms/register", "maishu-dilu", "../_config"], function (require, exports, React, register_1, maishu_dilu_1, _config_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var RegisterPage =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(RegisterPage, _React$Component);

    function RegisterPage(props) {
      var _this;

      _classCallCheck(this, RegisterPage);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(RegisterPage).call(this, props));
      _this.state = {
        buttonText: '发送验证码',
        buttonEnable: true
      };
      return _this;
    }

    _createClass(RegisterPage, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        register_1.setForm(this.formElement, {
          redirectURL: _config_1.config.registerRedirectURL || 'index'
        }, this.props.app);
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        return React.createElement("div", {
          className: "container"
        }, React.createElement("div", {
          ref: function ref(o) {
            return _this2.formElement = o || _this2.formElement;
          },
          className: "User-Register form-horizontal col-md-6 col-md-offset-3"
        }, React.createElement("h2", null, "\u7ACB\u5373\u6CE8\u518C"), React.createElement("hr", null), React.createElement("div", {
          className: "form-group"
        }, React.createElement("label", {
          className: "col-sm-2 control-label"
        }, "\u624B\u673A\u53F7\u7801"), React.createElement("div", {
          className: "col-sm-10"
        }, React.createElement("input", {
          name: register_1.MOBILE,
          type: "text",
          className: "form-control"
        }), React.createElement("span", {
          className: "mobile validationMessage",
          style: {
            display: 'none'
          }
        }))), React.createElement("div", {
          className: "form-group"
        }, React.createElement("label", {
          className: "col-sm-2 control-label"
        }, "\u9A8C\u8BC1\u7801"), React.createElement("div", {
          className: "col-sm-10"
        }, React.createElement("div", {
          className: "input-group"
        }, React.createElement("input", {
          name: register_1.VERIFY_CODE,
          className: "form-control"
        }), React.createElement("span", {
          className: "input-group-btn"
        }, React.createElement("button", {
          name: register_1.SEND_VERIFY_CODE,
          className: "btn btn-default",
          disabled: !this.state.buttonEnable
        }, "\u53D1\u9001\u9A8C\u8BC1\u7801"))), React.createElement("span", {
          className: "".concat(register_1.VERIFY_CODE, " ").concat(maishu_dilu_1.FormValidator.errorClassName),
          style: {
            display: 'none'
          }
        }))), React.createElement("div", {
          className: "form-group"
        }, React.createElement("label", {
          className: "col-sm-2 control-label"
        }, "\u5BC6\u7801"), React.createElement("div", {
          className: "col-sm-10"
        }, React.createElement("input", {
          type: "password",
          name: register_1.PASSWORD,
          className: "form-control"
        }))), React.createElement("div", {
          className: "form-group"
        }, React.createElement("label", {
          className: "col-sm-2 control-label"
        }, "\u786E\u8BA4\u5BC6\u7801"), React.createElement("div", {
          className: "col-sm-10"
        }, React.createElement("input", {
          type: "password",
          name: register_1.CONFIRM_PASSWORD,
          className: "form-control"
        }))), React.createElement("div", {
          className: "form-group"
        }, React.createElement("div", {
          className: "col-sm-offset-2 col-sm-10"
        }, React.createElement("button", {
          name: register_1.REGISTER,
          className: "btn btn-primary btn-block"
        }, React.createElement("i", {
          className: "icon-key"
        }), "\u7ACB\u5373\u6CE8\u518C"))), React.createElement("div", {
          className: "form-group"
        }, React.createElement("div", {
          className: "col-sm-offset-2 col-sm-10"
        }, React.createElement("div", {
          className: "pull-left"
        }, React.createElement("button", {
          className: "btn-link",
          onClick: function onClick() {
            return _this2.props.app.redirect('forget-password');
          }
        }, "\u5FD8\u8BB0\u5BC6\u7801")), React.createElement("div", {
          className: "pull-right"
        }, React.createElement("button", {
          className: "btn-link",
          onClick: function onClick() {
            return _this2.props.app.redirect("login");
          }
        }, "\u767B\u5F55"))))));
      }
    }]);

    return RegisterPage;
  }(React.Component);

  exports.default = RegisterPage;
});
