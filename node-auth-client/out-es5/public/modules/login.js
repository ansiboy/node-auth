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

define(["require", "exports", "react", "../_config", "../forms/login"], function (require, exports, React, _config_1, login_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var LoginPage =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(LoginPage, _React$Component);

    function LoginPage(props) {
      var _this;

      _classCallCheck(this, LoginPage);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(LoginPage).call(this, props));
      _this.state = {
        buttonText: '发送验证码',
        buttonEnable: true
      };
      return _this;
    }

    _createClass(LoginPage, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var redirectURL = this.props.data.redirect || _config_1.config.loginRedirectURL || '#index';
        login_1.setForm(this.element, {
          redirectURL: redirectURL
        }, this.props.app);
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        var _this$state = this.state,
            username = _this$state.username,
            password = _this$state.password;
        return React.createElement(React.Fragment, null, React.createElement("h1", {
          key: 8,
          className: "text-center",
          style: {
            paddingBottom: 50
          }
        }, _config_1.config.login.title), React.createElement("div", {
          key: 10,
          className: "form-horizontal container",
          style: {
            maxWidth: 500
          },
          ref: function ref(e) {
            return _this2.element = e || _this2.element;
          }
        }, React.createElement("div", {
          className: "form-group"
        }, React.createElement("label", {
          className: "col-sm-2 control-label"
        }, "\u7528\u6237\u540D"), React.createElement("div", {
          className: "col-sm-10"
        }, React.createElement("input", {
          name: login_1.USERNAME,
          type: "text",
          className: "form-control",
          value: username || '',
          onChange: function onChange(e) {
            _this2.setState({
              username: e.target.value
            });
          }
        }))), React.createElement("div", {
          className: "form-group"
        }, React.createElement("label", {
          className: "col-sm-2 control-label"
        }, "\u5BC6\u7801"), React.createElement("div", {
          className: "col-sm-10"
        }, React.createElement("input", {
          type: "password",
          name: login_1.PASSWORD,
          className: "form-control",
          value: password || '',
          onChange: function onChange(e) {
            _this2.setState({
              password: e.target.value
            });
          }
        }))), React.createElement("div", {
          className: "form-group"
        }, React.createElement("div", {
          className: "col-sm-offset-2 col-sm-10"
        }, React.createElement("button", {
          name: login_1.LOGIN,
          type: "button",
          className: "btn btn-primary btn-block"
        }, React.createElement("i", {
          className: "icon-key"
        }), "\u7ACB\u5373\u767B\u5F55"))), React.createElement("div", {
          className: "form-group"
        }, React.createElement("div", {
          className: "col-sm-offset-2 col-sm-10"
        }, _config_1.config.login.showForgetPassword ? React.createElement("div", {
          className: "pull-left"
        }, React.createElement("button", {
          name: "forget-password",
          className: "btn-link",
          onClick: function onClick() {
            return _this2.props.app.redirect("forget-password");
          }
        }, "\u5FD8\u8BB0\u5BC6\u7801")) : null, _config_1.config.login.showRegister ? React.createElement("div", {
          className: "pull-right"
        }, React.createElement("button", {
          name: "register",
          className: "btn-link",
          onClick: function onClick() {
            return _this2.props.app.redirect("register");
          }
        }, "\u6CE8\u518C")) : null))));
      }
    }]);

    return LoginPage;
  }(React.Component);

  exports.default = LoginPage;
});
