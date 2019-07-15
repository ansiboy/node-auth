"use strict";

define(["require", "exports"], function (require, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.errors = {
    argumentNull: function argumentNull(name) {
      return new Error("Argument ".concat(name, " cannt be null or empty."));
    },
    dataSourceNotExists: function dataSourceNotExists(name) {
      return new Error("Data source ".concat(name, " is not exists."));
    },
    mobileBindsDistributor: function mobileBindsDistributor(mobile) {
      var msg = "\u8D26\u53F7 ".concat(mobile, " \u5DF2\u7ECF\u7ED1\u5B9A\u5230\u53E6\u5916\u4E00\u4E2A\u7ECF\u9500\u5546");
      return new Error(msg);
    },
    argumentFieldNull: function argumentFieldNull(argumentName, fieldName) {
      return new Error("Argument ".concat(argumentName, " field ").concat(fieldName, " cannt ben null or emtpy."));
    },
    distributorNotAllowDelete: function distributorNotAllowDelete() {
      return new Error('经销商不允许删除');
    },
    brandExists: function brandExists(name) {
      return new Error("\u54C1\u724C\"".concat(name, "\"\u5DF2\u5B58\u5728"));
    },
    userExists: function userExists(mobile) {
      return new Error("\u7528\u6237\"".concat(mobile, "\"\u5DF2\u7ECF\u5B58\u5728"));
    },
    notImplement: function notImplement() {
      return new Error('Not implement.');
    },
    moduleIsNull: function moduleIsNull(path) {
      var msg = "Module ".concat(path, " is null.");
      return new Error(msg);
    },
    moduleHasNoneDefaultExports: function moduleHasNoneDefaultExports(path) {
      var msg = "Module ".concat(path, " has none default exports.");
      return new Error(msg);
    },
    moduleHasDefaultExportIsNotFunction: function moduleHasDefaultExportIsNotFunction(path) {
      var msg = "Default export of module ".concat(path, " is not a function.");
      return new Error(msg);
    }
  };
});
