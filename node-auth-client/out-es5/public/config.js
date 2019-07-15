"use strict";

define(["require", "exports"], function (require, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.config = {
    firstPanelWidth: 130,
    secondPanelWidth: 130,
    loginRedirectURL: "",
    logoutRedirectURL: "",
    registerRedirectURL: "",
    login: {
      title: "好易权限管理系统",
      showForgetPassword: true,
      showRegister: true
    },
    permissionServiceUrl: "http://127.0.0.1:2857/auth"
  };
});
