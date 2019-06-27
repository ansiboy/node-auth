var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "maishu-wuzhui-helper", "maishu-wuzhui", "react-dom", "../list-page", "react"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const maishu_wuzhui_helper_1 = require("maishu-wuzhui-helper");
    const maishu_wuzhui_1 = require("maishu-wuzhui");
    const ReactDOM = require("react-dom");
    const list_page_1 = require("../list-page");
    const React = require("react");
    function booleanSwitchField(args) {
        args.itemStyle = args.itemStyle || {};
        args.itemStyle.textAlign = args.itemStyle.textAlign || 'center';
        args.itemStyle.width = args.itemStyle.width || '100px';
        return maishu_wuzhui_helper_1.customField({
            headerText: args.headerText,
            itemStyle: args.itemStyle,
            headerStyle: args.headerStyle,
            createItemCell() {
                let self = this;
                let cell = new maishu_wuzhui_1.GridViewDataCell({
                    render(dataItem, element) {
                        ReactDOM.render(React.createElement(list_page_1.ListPageContext.Consumer, null, a => {
                            if (a != null) {
                                let dataSource = a.dataSource;
                                console.log(`dataSource ${dataSource}`);
                            }
                            return React.createElement("label", { className: "switch" },
                                React.createElement("input", { type: "checkbox", className: "ace ace-switch ace-switch-5", ref: e => {
                                        if (!e)
                                            return;
                                        let value;
                                        if (dataItem[args.dataField] == null && args.defaultValue != null) {
                                            value = args.defaultValue;
                                        }
                                        else {
                                            value = dataItem[args.dataField];
                                        }
                                        e.checked = value == true;
                                        e.onchange = () => __awaiter(this, void 0, void 0, function* () {
                                            console.assert(dataItem.id != null);
                                            let obj = { id: dataItem.id };
                                            obj[args.dataField] = e.checked;
                                            yield self.gridView.dataSource.executeUpdate(obj);
                                            dataItem[args.dataField] = e.checked;
                                        });
                                    } }),
                                React.createElement("span", { className: "lbl middle" }));
                        }), element);
                    }
                });
                return cell;
            }
        });
    }
    exports.booleanSwitchField = booleanSwitchField;
});
