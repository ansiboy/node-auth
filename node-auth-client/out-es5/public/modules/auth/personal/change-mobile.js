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

define(["require", "exports", "react", "assert/index", "assert/services/index", "maishu-dilu", "./change-password"], function (require, exports, React, index_1, index_2, maishu_dilu_1, change_password_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var NEW_MOBILE = "new_mobile";
  var VERIFY_CODE = "verify_code";

  var ChangeMobilePage =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(ChangeMobilePage, _React$Component);

    function ChangeMobilePage(props) {
      var _this;

      _classCallCheck(this, ChangeMobilePage);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ChangeMobilePage).call(this, props));
      _this.state = {};
      _this.ps = _this.props.createService(index_2.PermissionService);
      return _this;
    }

    _createClass(ChangeMobilePage, [{
      key: "save",
      value: function save() {
        return __awaiter(this, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (this.validator.check()) {
                    _context.next = 2;
                    break;
                  }

                  return _context.abrupt("return", Promise.reject("fail"));

                case 2:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        this.validator = new maishu_dilu_1.FormValidator(this.formElement, {
          name: VERIFY_CODE,
          rules: [maishu_dilu_1.rules.required("请输入验证码")]
        }, {
          name: NEW_MOBILE,
          rules: [maishu_dilu_1.rules.required("请输入新的手机号码"), maishu_dilu_1.rules.mobile("请输入正确的手机号码")]
        });
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        var _this$state = this.state,
            mobile = _this$state.mobile,
            verifyCode = _this$state.verifyCode;
        return React.createElement(index_1.Page, Object.assign({}, this.props, {
          context: {
            save: function save() {
              return _this2.save();
            }
          }
        }), React.createElement("div", {
          className: "well",
          ref: function ref(e) {
            return _this2.formElement = e || _this2.formElement;
          }
        }, React.createElement("div", {
          style: {
            maxWidth: 400
          }
        }, React.createElement("div", {
          className: "form-group clearfix input-control"
        }, React.createElement("label", null, "\u65B0\u624B\u673A"), React.createElement("span", null, React.createElement("input", {
          name: NEW_MOBILE,
          className: "form-control",
          value: mobile || "",
          onChange: function onChange(e) {
            return e ? _this2.setState({
              mobile: e.target.value
            }) : null;
          },
          placeholder: "\u8BF7\u8F93\u5165\u65B0\u624B\u673A\u53F7\u7801"
        }))), React.createElement("div", {
          className: "form-group clearfix input-control"
        }, React.createElement("label", null, "\u9A8C\u8BC1\u7801"), React.createElement("span", null, React.createElement("div", {
          className: "input-group"
        }, React.createElement("input", {
          name: VERIFY_CODE,
          className: "form-control",
          placeholder: "\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801",
          value: verifyCode || "",
          onChange: function onChange(e) {
            return e ? _this2.setState({
              verifyCode: e.target.value
            }) : null;
          }
        }), React.createElement("span", {
          className: "input-group-btn"
        }, React.createElement("button", {
          name: "sendVerifyCode",
          className: "btn btn-default",
          ref: function ref(e) {
            if (!e) return;

            e.onclick = function () {
              if (!_this2.validator.checkElement(NEW_MOBILE)) return;
              change_password_1.sendVerifyCode(e, mobile);
            };
          }
        }, "\u53D1\u9001\u9A8C\u8BC1\u7801"))), React.createElement("span", {
          className: "validationMessage ".concat(VERIFY_CODE),
          style: {
            display: "none"
          }
        }))))));
      }
    }]);

    return ChangeMobilePage;
  }(React.Component);

  exports.default = ChangeMobilePage;
}); // export default async function (page: Page) {
//     let menuItems = await dataSources.resource.executeSelect({})
//         .then(r => translateToMenuItems(r.dataItems));
//     let validator: FormValidator;
//     new PageView({
//         element: page.element,
//         resourceId: page.data["resourceId"] as string,
//         menuItems,
//         render(element: HTMLElement) {
//             ReactDOM.render(<div className="well">
//                 <div style={{ maxWidth: 400 }}>
//                     <div className="form-group clearfix input-control">
//                         <label>验证码</label>
//                         <span>
//                             <div className="input-group">
//                                 <input name={VERIFY_CODE} className="form-control"
//                                     placeholder="请输入验证码" />
//                                 <span className="input-group-btn">
//                                     <button name="sendVerifyCode" className="btn btn-default">
//                                         发送验证码
//                                 </button>
//                                 </span>
//                             </div>
//                             <span className={`validationMessage ${VERIFY_CODE}`} style={{ display: "none" }}></span>
//                         </span>
//                     </div>
//                     <div className="form-group clearfix input-control" >
//                         <label>新手机</label>
//                         <span>
//                             <input name={NEW_MOBILE} className="form-control"
//                                 placeholder="请输入新手机号码" />
//                         </span>
//                     </div>
//                 </div>
//             </div>, element)
//             validator = new FormValidator(element,
//                 { name: VERIFY_CODE, rules: [rules.required("请输入验证码")] },
//                 { name: NEW_MOBILE, rules: [rules.required("请输入新密码"), rules.mobile("请输入正确的手机号码")] }
//             )
//         },
//         context: {
//             save() {
//                 if (!validator.check())
//                     return Promise.reject();
//             }
//         }
//     })
// }
