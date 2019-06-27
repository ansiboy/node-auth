(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "maishu-wuzhui"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const maishu_wuzhui_1 = require("maishu-wuzhui");
    function customDataField(params) {
        return new maishu_wuzhui_1.CustomField({
            headerText: params.headerText,
            headerStyle: params.headerStyle,
            itemStyle: params.itemStyle,
            createItemCell() {
                let cell = new maishu_wuzhui_1.GridViewDataCell({
                    render(dataItem, element) {
                        // if (dataItem.data != null && dataItem.data.nick_name != null) {
                        //     element.innerHTML = dataItem.data.nick_name
                        // }
                        let r = params.render(dataItem, element);
                        if (r)
                            element.innerHTML = r;
                    }
                });
                return cell;
            }
        });
    }
    exports.customDataField = customDataField;
});
