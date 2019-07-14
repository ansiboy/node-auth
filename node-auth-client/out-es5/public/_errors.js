"use strict";

define(["require", "exports"], function (require, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.errors = {
    elementNotExistsWithName: function elementNotExistsWithName(name) {
      var msg = "Element with name ".concat(name, " is not exists.");
      var error = new Error(msg);
      error.name = exports.errors.elementNotExistsWithName.name;
      return error;
    },
    argumentNull: function argumentNull(name) {
      var msg = "Argument ".concat(name, " is null or empty.");
      var error = new Error(msg);
      error.name = exports.errors.argumentNull.name;
      return error;
    },
    fieldNull: function fieldNull(itemName, fieldName) {
      var msg = "Argument ".concat(itemName, " field of ").concat(fieldName, "  is null or empty.");
      var error = new Error(msg);
      error.name = exports.errors.fieldNull.name;
      return error;
    },
    masterPageNameCanntEmpty: function masterPageNameCanntEmpty() {
      var msg = "Name of the master page can be null or empty.";
      var error = new Error(msg);
      error.name = exports.errors.masterPageNameCanntEmpty.name;
      return error;
    },
    masterNotExists: function masterNotExists(masterName) {
      var msg = "Master '".concat(masterName, "' is not exists.");
      var error = new Error(msg);
      error.name = exports.errors.masterNotExists.name;
      return error;
    },
    masterPageExists: function masterPageExists(masterName) {
      var msg = "Master '".concat(masterName, "' is exists.");
      var error = new Error(msg);
      error.name = exports.errors.masterPageExists.name;
      return error;
    },
    masterContainerIsNull: function masterContainerIsNull(name) {
      var msg = "Container of master '".concat(name, "' is null.");
      var error = new Error(msg);
      error.name = exports.errors.masterContainerIsNull.name;
      return error;
    },
    authServiceHostNotConfig: function authServiceHostNotConfig() {
      var msg = "Auth service host is not config";
      var error = new Error(msg);
      error.name = exports.errors.authServiceHostNotConfig.name;
      return error;
    },
    registerButtonNotExists: function registerButtonNotExists() {
      var msg = "Register button is not exists";
      var error = new Error(msg);
      error.name = exports.errors.registerButtonNotExists.name;
      return error;
    },
    sendVerifyCodeButtonNotExists: function sendVerifyCodeButtonNotExists() {
      var msg = "Send verify code button is not exists.";
      var error = new Error(msg);
      error.name = exports.errors.sendVerifyCodeButtonNotExists.name;
      return error;
    },
    unexpectedNullResult: function unexpectedNullResult() {
      var msg = "Null result is unexpected.";
      return new Error(msg);
    }
  };
});
