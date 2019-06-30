(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react", "../errors", "../item-page", "maishu-wuzhui-helper"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const React = require("react");
    const errors_1 = require("../errors");
    const item_page_1 = require("../item-page");
    const maishu_wuzhui_helper_1 = require("maishu-wuzhui-helper");
    class RadioField extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
        }
        render() {
            let { dataField, name, label, items: values } = this.props;
            return React.createElement(item_page_1.ItemPageContext.Consumer, null, args => {
                let dataItem = args.dataItem || {};
                dataItem[dataField] = dataItem[dataField] || this.props.defaultValue;
                let value = this.state.value || dataItem[dataField];
                return React.createElement("div", { className: "item" },
                    React.createElement("label", null, label),
                    React.createElement("span", null, values.map((o, i) => React.createElement("label", { key: i, className: "radio-inline" },
                        React.createElement("input", { type: "radio", name: name || dataField, value: o.value, checked: o.value == value, onChange: e => {
                                if (this.props.dataType == 'number') {
                                    dataItem[dataField] = /^-?\\d+$/.test(e.target.value) ? Number.parseInt(e.target.value) : Number.parseFloat(e.target.value);
                                }
                                else if (this.props.dataType == 'string') {
                                    dataItem[dataField] = e.target.value;
                                }
                                else {
                                    throw errors_1.errors.notImplement();
                                }
                                value = e.target.value;
                                this.setState({ value });
                            } }),
                        o.name))));
            });
        }
    }
    exports.RadioField = RadioField;
    class RadioField1 extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
        }
        render() {
            let { dataField, label, dataSource, nameField, valueField } = this.props;
            return React.createElement(item_page_1.ItemPageContext.Consumer, null, args => {
                let dataItem = args.dataItem || {};
                dataItem[dataField] = dataItem[dataField] || this.props.defaultValue;
                return React.createElement("div", { className: "item" },
                    React.createElement("label", null, label),
                    React.createElement("span", { ref: e => {
                            if (!e)
                                return;
                            maishu_wuzhui_helper_1.radioList({
                                element: e,
                                dataSource: dataSource,
                                dataField: dataField,
                                nameField: nameField,
                                valueField: valueField,
                                dataItem: dataItem
                            });
                        } }));
            });
        }
    }
    exports.RadioField1 = RadioField1;
});
