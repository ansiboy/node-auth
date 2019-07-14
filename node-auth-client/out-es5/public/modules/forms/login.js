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

define(["require", "exports", "maishu-dilu", "../errors", "maishu-ui-toolkit", "maishu-services-sdk"], function (require, exports, maishu_dilu_1, errors_1, maishu_ui_toolkit_1, maishu_services_sdk_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.USERNAME = 'username';
  exports.PASSWORD = 'password';
  exports.LOGIN = 'login';
  /** 设置登录表单 */

  function setForm(formElement, options, app) {
    var _this = this;

    if (!formElement) throw errors_1.errors.argumentNull('formElement');
    if (!options) throw errors_1.errors.argumentNull('options');
    if (!options.redirectURL) throw errors_1.errors.fieldNull("options", "redirectURL");
    var validator = new maishu_dilu_1.FormValidator(formElement, {
      name: exports.USERNAME,
      rules: [maishu_dilu_1.rules.required('请输入用户名')]
    }, {
      name: exports.PASSWORD,
      rules: [maishu_dilu_1.rules.required('请输入密码')]
    });
    var usernameInput = getElement(formElement, exports.USERNAME);
    var passwordInput = getElement(formElement, exports.PASSWORD);
    var loginButton = getElement(formElement, exports.LOGIN);
    loginButton.addEventListener('click', function () {
      if (validator.check() == false) return Promise.reject('validate fail');
    });
    maishu_ui_toolkit_1.buttonOnClick(loginButton, function () {
      return __awaiter(_this, void 0, void 0,
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var userService, username, password;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(validator.check() == false)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", Promise.reject('validate fail'));

              case 2:
                userService = app.createService(maishu_services_sdk_1.UserService);
                username = usernameInput.value;
                password = passwordInput.value;
                _context.next = 7;
                return userService.login(username, password);

              case 7:
                console.assert(options.redirectURL != null);
                location.href = options.redirectURL;

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
    });
    return options;
  }

  exports.setForm = setForm;

  function getElement(formElement, name) {
    var element = formElement.querySelector("[name=\"".concat(name, "\"]"));
    if (element == null) throw errors_1.errors.elementNotExistsWithName(name);
    return element;
  }
});
