"use strict";

define(["require", "exports"], function (require, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.errors = {
    unknonwResourceName: function unknonwResourceName(resourceName) {
      var msg = "Resource name '".concat(resourceName, "' is unknown.");
      return new Error(msg);
    },
    resourceDataFieldMissing: function resourceDataFieldMissing(resource, fieldName) {
      var msg = "Resource data field '".concat(fieldName, "' is missing, resource id is ").concat(resource.id, ".");
      return new Error(msg);
    },
    buttonExecutePahtIsEmpty: function buttonExecutePahtIsEmpty(resource) {
      var msg = "The execute_path of resource '".concat(resource.id, "' is empty.");
      return new Error(msg);
    },
    executePathIncorrect: function executePathIncorrect(executePath) {
      var msg = "Execute path '".concat(executePath, "' is incorrect.");
      return new Error(msg);
    },
    contextIsNull: function contextIsNull() {
      var msg = "The context object is null.";
      return new Error(msg);
    },
    contextMemberIsNotExist: function contextMemberIsNotExist(memberName) {
      var msg = "Context member '".concat(memberName, "' is not exists.");
      return new Error(msg);
    },
    contextMemberIsNotFunction: function contextMemberIsNotFunction(memberName) {
      var msg = "Context member '".concat(memberName, "' is not a function.");
      return new Error(msg);
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
