(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react", "../item-page"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const React = require("react");
    const item_page_1 = require("../item-page");
    class DropdownField extends React.Component {
        constructor(props) {
            super(props);
            this.state = { items: [] };
        }
        componentDidMount() {
        }
        render() {
            let { dataField, label, name, placeholder } = this.props;
            return React.createElement(item_page_1.ItemPageContext.Consumer, null, args => {
                let dataItem = args.dataItem || {};
                return React.createElement("div", { className: "item" },
                    React.createElement("label", null, label),
                    React.createElement("span", null,
                        React.createElement("select", { name: name || dataField, className: "form-control", ref: e => {
                                if (!e)
                                    return;
                                e.value = dataItem[dataField] || '';
                                e.onchange = () => {
                                    dataItem[dataField] = e.value;
                                    if (this.props.onChange) {
                                        this.props.onChange(e.value, dataItem);
                                    }
                                    args.updatePageState(dataItem);
                                };
                                this.props.items().then(items => {
                                    items.forEach(item => {
                                        let optionElement = document.createElement('option');
                                        optionElement.value = item.value;
                                        optionElement.innerHTML = item.name;
                                        e.options.add(optionElement);
                                        return optionElement;
                                    });
                                });
                            } }, placeholder ? React.createElement("option", { value: "" }, placeholder) : null)));
            });
        }
    }
    exports.DropdownField = DropdownField;
});
