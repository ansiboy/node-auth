"use strict";

define(["require", "exports", "maishu-ui-toolkit"], function (require, exports, ui) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var errorMessages = {
    "726": "没有权限访问"
  };

  function errorHandle(error, app, page) {
    error.message = errorMessages[error.name] || error.message;
    ui.alert({
      title: "错误",
      message: error.message
    });
  }

  exports.default = errorHandle;
});
