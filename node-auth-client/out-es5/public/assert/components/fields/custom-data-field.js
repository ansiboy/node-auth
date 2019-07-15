"use strict";

define(["require", "exports", "maishu-wuzhui"], function (require, exports, maishu_wuzhui_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function customDataField(params) {
    return new maishu_wuzhui_1.CustomField({
      headerText: params.headerText,
      headerStyle: params.headerStyle,
      itemStyle: params.itemStyle,
      createItemCell: function createItemCell() {
        var cell = new maishu_wuzhui_1.GridViewDataCell({
          render: function render(dataItem, element) {
            var r = params.render(dataItem, element);
            if (r) element.innerHTML = r;
          }
        });
        return cell;
      }
    });
  }

  exports.customDataField = customDataField;
});
