(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react", "data-component/item-page"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const React = require("react");
    const item_page_1 = require("data-component/item-page");
    class InputField extends React.Component {
        constructor(props) {
            super(props);
            this.state = { dataItem: {} };
        }
        get value() {
            return this.input.value;
        }
        render() {
            let { dataField, label, name, placeholder } = this.props;
            return React.createElement(item_page_1.ItemPageContext.Consumer, null, args => {
                let dataItem = args.dataItem || {};
                return React.createElement("div", { className: "item" },
                    React.createElement("label", null, label),
                    React.createElement("span", null,
                        React.createElement("input", { name: name || dataField, className: "form-control", placeholder: placeholder, type: this.props.type, ref: e => {
                                if (!e)
                                    return;
                                this.input = e;
                                e.value = dataItem[dataField] || '';
                                e.onchange = () => {
                                    dataItem[dataField] = e.value;
                                };
                            } })));
            });
        }
    }
    exports.InputField = InputField;
});
