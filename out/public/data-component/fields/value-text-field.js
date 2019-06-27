(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "maishu-wuzhui-helper", "maishu-wuzhui"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const maishu_wuzhui_helper_1 = require("maishu-wuzhui-helper");
    const maishu_wuzhui_1 = require("maishu-wuzhui");
    function valueTextField(args) {
        return maishu_wuzhui_helper_1.customField({
            headerText: args.headerText,
            sortExpression: args.sortExpression,
            itemStyle: args.itemStyle,
            createItemCell() {
                let cell = new maishu_wuzhui_1.GridViewDataCell({
                    render(dataItem, element) {
                        let value = dataItem[args.dataField];
                        let text = args.items[value] || value;
                        element.innerHTML = text;
                    }
                });
                return cell;
            }
        });
    }
    exports.valueTextField = valueTextField;
});
