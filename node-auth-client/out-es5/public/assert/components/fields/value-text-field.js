"use strict";

define(["require", "exports", "maishu-wuzhui-helper", "maishu-wuzhui"], function (require, exports, maishu_wuzhui_helper_1, maishu_wuzhui_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function valueTextField(args) {
    return maishu_wuzhui_helper_1.customField({
      headerText: args.headerText,
      sortExpression: args.sortExpression,
      itemStyle: args.itemStyle,
      createItemCell: function createItemCell() {
        var cell = new maishu_wuzhui_1.GridViewDataCell({
          render: function render(dataItem, element) {
            var value = dataItem[args.dataField];
            var text = args.items[value] || value;
            element.innerHTML = text;
          }
        });
        return cell;
      }
    });
  }

  exports.valueTextField = valueTextField;
});
