"use strict";

define(["require", "exports", "assert/index", "assert/dataSources", "maishu-ui-toolkit"], function (require, exports, index_1, dataSources_1, ui) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function default_1(args) {
    var button = index_1.Buttons.createListDeleteButton(function () {
      ui.confirm({
        title: "提示",
        message: "\u786E\u5B9A\u5220\u9664\u89D2\u8272'".concat(args.dataItem.name, "'\u5417?"),
        confirm: function confirm() {
          return dataSources_1.dataSources.resource.delete(args.dataItem);
        }
      });
    });
    return button;
  }

  exports.default = default_1;
});
