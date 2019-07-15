"use strict";

define(["require", "exports", "maishu-wuzhui-helper", "maishu-wuzhui"], function (require, exports, maishu_wuzhui_helper_1, maishu_wuzhui_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function sortNumberField() {
    return maishu_wuzhui_helper_1.customField({
      headerText: '序号',
      headerStyle: {
        width: '80px'
      },
      itemStyle: {
        width: '80px'
      },
      createItemCell: function createItemCell(dataItem) {
        var self = this;
        var cell = new maishu_wuzhui_1.GridViewCell();
        cell.element.innerHTML = "".concat(self.gridView.element.tBodies[0].rows.length + self.gridView.selectArguments.startRowIndex);
        return cell;
      }
    });
  }

  exports.sortNumberField = sortNumberField;
});
