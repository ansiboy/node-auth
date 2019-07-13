"use strict";

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

define(["require", "exports", "maishu-dilu", "maishu-ui-toolkit", "../../errors", "maishu-services-sdk"], function (require, exports, maishu_dilu_1, maishu_ui_toolkit_1, errors_1, maishu_services_sdk_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  }); // import { app } from "../index";

  exports.CONFIRM_PASSWORD = 'confirmPassword';
  exports.MOBILE = 'mobile';
  exports.PASSWORD = 'password';
  exports.RESET_PASSWORD = 'resetPassword';
  exports.SEND_VERIFY_CODE = 'sendVerifyCode';
  exports.VERIFY_CODE = 'verifyCode';

  function setForm(formElement, app) {
    var _this = this;

    if (!formElement) throw errors_1.errors.argumentNull('formElement');
    var validator = new maishu_dilu_1.FormValidator(formElement, {
      name: exports.MOBILE,
      rules: [maishu_dilu_1.rules.required('请输入手机号')]
    }, {
      name: exports.VERIFY_CODE,
      rules: [maishu_dilu_1.rules.required('请输入验证码')]
    }, {
      name: exports.PASSWORD,
      rules: [maishu_dilu_1.rules.required('请输入密码')]
    }, {
      name: exports.CONFIRM_PASSWORD,
      rules: [maishu_dilu_1.rules.required('请再次输入密码')]
    });
    var resetPasswordButton = getElement(formElement, exports.RESET_PASSWORD);
    if (!resetPasswordButton) throw errors_1.errors.registerButtonNotExists();
    var sendVerifyCodeButton = getElement(formElement, exports.SEND_VERIFY_CODE);
    if (!sendVerifyCodeButton) throw errors_1.errors.sendVerifyCodeButtonNotExists();
    var mobileInput = getElement(formElement, exports.MOBILE);
    if (!mobileInput) throw errors_1.errors.elementNotExistsWithName(exports.MOBILE);
    var passwordInput = getElement(formElement, exports.PASSWORD);
    if (!passwordInput) throw errors_1.errors.elementNotExistsWithName(exports.PASSWORD);
    var confirmInput = getElement(formElement, exports.CONFIRM_PASSWORD);
    if (!confirmInput) throw errors_1.errors.elementNotExistsWithName(exports.CONFIRM_PASSWORD);
    var verifyCodeInput = getElement(formElement, exports.VERIFY_CODE);
    if (!verifyCodeInput) throw errors_1.errors.elementNotExistsWithName(exports.VERIFY_CODE);
    var smsId;
    maishu_ui_toolkit_1.buttonOnClick(sendVerifyCodeButton, function () {
      return __awaiter(_this, void 0, void 0,
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (validator.checkElement(exports.MOBILE)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", Promise.reject('validate mobile element fail'));

              case 2:
                resetPasswordButton.setAttribute('disabled', '');
                _context.next = 5;
                return sendVerifyCode(mobileInput.value, sendVerifyCodeButton, app);

              case 5:
                smsId = _context.sent;
                resetPasswordButton.removeAttribute('disabled');

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
    });
    maishu_ui_toolkit_1.buttonOnClick(resetPasswordButton, function () {
      return __awaiter(_this, void 0, void 0,
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var mobile, password, verifyCode, userService;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(validator.check() == false)) {
                  _context2.next = 2;
                  break;
                }

                throw Promise.reject('validate register form fail');

              case 2:
                mobile = mobileInput.value;
                password = passwordInput.value;
                verifyCode = verifyCodeInput.value; // await register(mobile, password, smsId, verifyCode, data)

                userService = app.createService(maishu_services_sdk_1.UserService);
                _context2.next = 8;
                return userService.resetPassword(mobile, password, smsId, verifyCode);

              case 8:
                maishu_ui_toolkit_1.alert({
                  title: '提示',
                  message: '重置密码成功'
                });

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
    });
  }

  exports.setForm = setForm;

  function getElement(formElement, name) {
    var element = formElement.querySelector("[name=\"".concat(name, "\"]"));
    return element;
  }

  function sendVerifyCode(mobile, button, app) {
    return __awaiter(this, void 0, void 0,
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      var userService, data, buttonText, letfSeconds, intervalId;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (mobile) {
                _context3.next = 2;
                break;
              }

              throw errors_1.errors.argumentNull('mobile');

            case 2:
              if (button) {
                _context3.next = 4;
                break;
              }

              throw errors_1.errors.argumentNull('button');

            case 4:
              userService = app.createService(maishu_services_sdk_1.UserService);
              _context3.next = 7;
              return userService.sendResetVerifyCode(mobile);

            case 7:
              data = _context3.sent;
              button.setAttribute("disabled", "");
              buttonText = button.innerText;
              letfSeconds = 60;
              button.innerText = "".concat(buttonText, "(").concat(letfSeconds, ")");
              intervalId = window.setInterval(function () {
                letfSeconds = letfSeconds - 1;
                button.innerText = "".concat(buttonText, "(").concat(letfSeconds, ")");

                if (letfSeconds <= 0) {
                  window.clearInterval(intervalId);
                  button.removeAttribute("disabled");
                  button.innerText = buttonText;
                }
              }, 1000);
              return _context3.abrupt("return", data.smsId);

            case 14:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
  }
});
