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

define(["require", "exports", "react", "maishu-dilu", "assert/services/index", "error-handle", "maishu-ui-toolkit", "assert/index"], function (require, exports, React, maishu_dilu_1, index_1, error_handle_1, maishu_ui_toolkit_1, index_2) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var NEW_PASSWORD = "new_password";
  var VERIFY_CODE = "verify_code";
  var MOBILE = "mobile";

  var ChagePasswordPage =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(ChagePasswordPage, _React$Component);

    function ChagePasswordPage(props) {
      var _this;

      _classCallCheck(this, ChagePasswordPage);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ChagePasswordPage).call(this, props));
      _this.state = {};
      _this.ps = new index_1.PermissionService(function (err) {
        return error_handle_1.default(err);
      });
      return _this;
    }

    _createClass(ChagePasswordPage, [{
      key: "save",
      value: function save() {
        if (!this.validator.check()) return Promise.reject();

        if (!this.smsId) {
          maishu_ui_toolkit_1.alert({
            title: "错误",
            message: "验证码不正确"
          });
          return Promise.reject("sms is null");
        }

        var _this$state = this.state,
            mobile = _this$state.mobile,
            verifyCode = _this$state.verifyCode,
            newPassword = _this$state.newPassword;
        return this.ps.user.resetPassword(mobile, newPassword, this.smsId, verifyCode);
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this2 = this;

        this.ps.user.me().then(function (user) {
          _this2.setState({
            mobile: user.mobile
          });
        });
        this.validator = new maishu_dilu_1.FormValidator(this.formElement, {
          name: MOBILE,
          rules: [maishu_dilu_1.rules.required("手机号码不能为空")]
        }, {
          name: VERIFY_CODE,
          rules: [maishu_dilu_1.rules.required("请输入验证码")]
        }, {
          name: NEW_PASSWORD,
          rules: [maishu_dilu_1.rules.required("请输入新密码")]
        });
      }
    }, {
      key: "render",
      value: function render() {
        var _this3 = this;

        var _this$state2 = this.state,
            mobile = _this$state2.mobile,
            verifyCode = _this$state2.verifyCode,
            newPassword = _this$state2.newPassword;
        return React.createElement(index_2.Page, Object.assign({}, this.props, {
          context: {
            save: function save() {
              return _this3.save();
            }
          }
        }), React.createElement("div", {
          className: "well",
          ref: function ref(e) {
            return _this3.formElement = _this3.formElement || e;
          }
        }, React.createElement("div", {
          style: {
            maxWidth: 400
          }
        }, React.createElement("div", {
          className: "form-group clearfix input-control"
        }, React.createElement("label", null, "\u624B\u673A\u53F7"), React.createElement("span", null, React.createElement("input", {
          name: MOBILE,
          value: mobile || "",
          style: {
            border: "none",
            backgroundColor: "unset",
            fontWeight: "bold"
          },
          readOnly: true
        }))), React.createElement("div", {
          className: "form-group clearfix input-control"
        }, React.createElement("label", null, "\u9A8C\u8BC1\u7801"), React.createElement("span", null, React.createElement("div", {
          className: "input-group"
        }, React.createElement("input", {
          name: VERIFY_CODE,
          className: "form-control",
          value: verifyCode || "",
          onChange: function onChange(e) {
            _this3.setState({
              verifyCode: e.target.value
            });
          },
          ref: function ref(e) {
            return _this3.verifyCodeElement = e || _this3.verifyCodeElement;
          },
          placeholder: "\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801"
        }), React.createElement("span", {
          className: "input-group-btn"
        }, React.createElement("button", {
          name: "sendVerifyCode",
          className: "btn btn-default",
          ref: function ref(e) {
            if (!e) return;

            e.onclick = function () {
              if (!_this3.validator.checkElement(MOBILE)) return;
              sendVerifyCode(e, mobile);
            };
          }
        }, "\u53D1\u9001\u9A8C\u8BC1\u7801"))), React.createElement("span", {
          className: "validationMessage ".concat(VERIFY_CODE),
          style: {
            display: "none"
          }
        }))), React.createElement("div", {
          className: "form-group clearfix input-control"
        }, React.createElement("label", null, "\u65B0\u5BC6\u7801"), React.createElement("span", null, React.createElement("input", {
          name: NEW_PASSWORD,
          className: "form-control",
          type: "password",
          value: newPassword || "",
          onChange: function onChange(e) {
            if (!e) return;

            _this3.setState({
              newPassword: e.target.value
            });
          },
          ref: function ref(e) {
            return _this3.newPasswordElement = e || _this3.newPasswordElement;
          },
          placeholder: "\u8BF7\u8F93\u5165\u65B0\u5BC6\u7801"
        }))))));
      }
    }]);

    return ChagePasswordPage;
  }(React.Component);

  exports.default = ChagePasswordPage;
  var ps = new index_1.PermissionService(function (err) {
    return error_handle_1.default(err);
  });

  function sendVerifyCode(button, mobile) {
    return __awaiter(this, void 0, void 0,
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var _this4 = this;

      var seconds, timeId;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (button) {
                _context.next = 2;
                break;
              }

              throw index_2.errors.argumentNull("button");

            case 2:
              if (mobile) {
                _context.next = 4;
                break;
              }

              throw index_2.errors.argumentNull("mobile");

            case 4:
              ps.sms.sendResetVerifyCode(mobile).then(function (r) {
                _this4.smsId = r.smsId;
              }).catch(function (err) {
                clearInterval(timeId);
                button.disabled = false;
                button.innerHTML = "\u53D1\u9001\u9A8C\u8BC1\u7801";
                console.error(err);
              });
              button.disabled = true;
              seconds = 60;
              button.innerHTML = "".concat(seconds, "\u79D2\u91CD\u53D1");
              timeId = setInterval(function () {
                seconds = seconds - 1;

                if (seconds <= 0) {
                  clearInterval(timeId);
                  button.innerHTML = "\u53D1\u9001\u9A8C\u8BC1\u7801";
                  button.disabled = false;
                  return;
                }

                button.innerHTML = "".concat(seconds, "\u79D2\u91CD\u53D1");
              }, 1000);

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
  }

  exports.sendVerifyCode = sendVerifyCode;
}); // export default async function (page: Page) {
//     let menuItems = await dataSources.resource.executeSelect({})
//         .then(r => translateToMenuItems(r.dataItems));
//     let validator: FormValidator;
//     let mobileElement: HTMLElement;
//     let newPasswordElement: HTMLInputElement;
//     let verifyCodeElement: HTMLInputElement;
//     let me: User;
//     let smsId: string;
//     new PageView({
//         element: page.element,
//         resourceId: page.data["resourceId"] as string,
//         menuItems,
//         context: {
//             save() {
//                 if (!validator.check())
//                     return Promise.reject();
//                 if (!smsId) {
//                     alert({ title: "错误", message: "验证码不正确" })
//                     return;
//                 }
//                 let verifyCode = verifyCodeElement.value;
//                 return ps.user.resetPassword(me.mobile, newPasswordElement.value, smsId, verifyCode);
//             }
//         }
//     })
//     let bodyElement = document.createElement("div");
//     page.element.appendChild(bodyElement);
//     ReactDOM.render(<div className="well">
//         <div style={{ maxWidth: 400 }}>
//             <div className="form-group clearfix input-control">
//                 <label>手机号</label>
//                 <span>
//                     <label ref={(e) => mobileElement = mobileElement || e}></label>
//                 </span>
//             </div>
//             <div className="form-group clearfix input-control">
//                 <label>验证码</label>
//                 <span>
//                     <div className="input-group">
//                         <input name={VERIFY_CODE} className="form-control"
//                             ref={e => verifyCodeElement = e || verifyCodeElement}
//                             placeholder="请输入验证码" />
//                         <span className="input-group-btn">
//                             <button name="sendVerifyCode" className="btn btn-default"
//                                 ref={e => {
//                                     if (!e) return;
//                                     e.onclick = () => sendVerifyCode(e, (r) => smsId = r);
//                                 }}>
//                                 发送验证码
//                                     </button>
//                         </span>
//                     </div>
//                     <span className={`validationMessage ${VERIFY_CODE}`} style={{ display: "none" }}></span>
//                 </span>
//             </div>
//             <div className="form-group clearfix input-control" >
//                 <label>新密码</label>
//                 <span>
//                     <input name={NEW_PASSWORD} className="form-control" type="password"
//                         ref={e => newPasswordElement = e || newPasswordElement}
//                         placeholder="请输入新密码" />
//                 </span>
//             </div>
//         </div>
//     </div>, bodyElement)
//     validator = new FormValidator(bodyElement,
//         { name: VERIFY_CODE, rules: [rules.required("请输入验证码")] },
//         { name: NEW_PASSWORD, rules: [rules.required("请输入新密码")] }
//     )
//     let ps = new PermissionService((err) => errorHandle(err))
//     ps.user.me().then(user => {
//         me = user;
//         mobileElement.innerHTML = user.mobile;
//     })
//     //mobileElement
//     async function sendVerifyCode(button: HTMLButtonElement, callback: (smsId: string) => void) {
//         ps.sms.sendResetVerifyCode(me.mobile)
//             .then(r => {
//                 callback(r.smsId);
//             })
//             .catch(err => {
//                 clearInterval(timeId);
//                 button.disabled = false;
//                 button.innerHTML = `发送验证码`;
//                 console.error(err);
//             })
//         button.disabled = true;
//         let seconds = 60;
//         button.innerHTML = `${seconds}秒重发`;
//         let timeId = setInterval(() => {
//             seconds = seconds - 1;
//             if (seconds <= 0) {
//                 clearInterval(timeId);
//                 button.innerHTML = `发送验证码`;
//                 button.disabled = false;
//                 return;
//             }
//             button.innerHTML = `${seconds}秒重发`;
//         }, 1000);
//     }
// }
