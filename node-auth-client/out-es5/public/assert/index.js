"use strict";

define(["require", "exports", "assert/components/index", "assert/controls/index", "./errors", "./application"], function (require, exports, index_1, index_2, errors_1, application_1) {
  "use strict";

  function __export(m) {
    for (var p in m) {
      if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
  }

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  __export(index_1);

  __export(index_2);

  exports.errors = errors_1.errors;
  exports.app = application_1.app;
});
