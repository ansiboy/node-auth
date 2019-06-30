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
        define(["require", "exports", "react", "maishu-dilu", "dataSources", "services/permission-service", "../../data-component/index", "../../common"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const React = require("react");
    const maishu_dilu_1 = require("maishu-dilu");
    const dataSources_1 = require("dataSources");
    const permission_service_1 = require("services/permission-service");
    const index_1 = require("../../data-component/index");
    const common_1 = require("../../common");
    class ResourceAdd extends React.Component {
        constructor(props) {
            super(props);
            this.state = { checkedChildren: [] };
        }
        render() {
            return React.createElement(index_1.ItemPage, Object.assign({}, this.props, { beforeSave: (dataItem) => __awaiter(this, void 0, void 0, function* () {
                    dataItem.type = 'menu';
                }) }),
                React.createElement(index_1.ItemPageContext.Consumer, null, args => {
                    let dataItem = args.dataItem;
                    return React.createElement(React.Fragment, null,
                        React.createElement("div", { style: { display: 'table-cell', borderRight: 'solid 1px #cccccc', paddingRight: 40 } },
                            React.createElement(index_1.InputField, { label: "\u5E8F\u53F7", dataField: "sort_number", placeholder: "\u7528\u4E8E\u5BF9\u83DC\u5355\u6392\u5E8F\uFF0C\u53EF\u7A7A" }),
                            React.createElement(index_1.DropdownField, { key: dataItem.category || '', label: "\u6240\u5C5E\u83DC\u5355", dataField: "parent_id", placeholder: "\u8BF7\u9009\u62E9\u6240\u5C5E\u83DC\u5355\uFF0C\u53EF\u7A7A", items: () => __awaiter(this, void 0, void 0, function* () {
                                    let args = {};
                                    if (dataItem.category) {
                                        args.filter = `category = '${dataItem.category}'`;
                                    }
                                    let menuDataSource = dataSources_1.dataSources.menu;
                                    let result = yield menuDataSource.executeSelect(args);
                                    let r = result.dataItems.map(o => ({ name: o.name, value: o.id }));
                                    return r;
                                }) }),
                            React.createElement(index_1.InputField, { label: "\u540D\u79F0", dataField: "name", validateRules: [maishu_dilu_1.rules.required('请输入菜单名称')], placeholder: "\u8BF7\u8F93\u5165\u83DC\u5355\u540D\u79F0" }),
                            React.createElement(index_1.InputField, { label: "\u8DEF\u5F84", dataField: "path", placeholder: "\u83DC\u5355\u9875\u9762\u7684\u8DEF\u5F84\uFF0C\u53EF\u7A7A" }),
                            React.createElement(index_1.ItemPageContext.Consumer, null, args => {
                                let ps = this.props.createService(permission_service_1.PermissionService);
                                return React.createElement(OperationField, { ref: e => this.operationField = e || this.operationField, dataItem: args.dataItem, updatePageState: args.updatePageState, service: ps });
                            }),
                            React.createElement(index_1.RadioField, { dataType: 'number', label: "\u7C7B\u578B", dataField: "category", items: common_1.categroyNames, defaultValue: common_1.platformCategory })),
                        React.createElement("div", { style: { display: 'table-cell', paddingLeft: 30 } },
                            React.createElement(index_1.ItemPageContext.Consumer, null, args => {
                                let dataItem = args.dataItem;
                                return React.createElement("div", { style: { width: 400 } },
                                    React.createElement("div", { className: "item" },
                                        React.createElement("label", null, "\u64CD\u4F5C\u9879")),
                                    React.createElement("div", { className: "item" },
                                        React.createElement(OperationTable, { dataItem: dataItem })));
                            })));
                }));
        }
    }
    exports.default = ResourceAdd;
    class OperationTable extends React.Component {
        constructor(props) {
            super(props);
            this.state = { dataItem: props.dataItem };
        }
        componentWillReceiveProps(props) {
            this.setState({ dataItem: props.dataItem });
        }
        render() {
            let { dataItem } = this.state;
            return React.createElement("table", { className: "table table-striped table-bordered table-hover" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { style: { width: 60 } }, "\u5E8F\u53F7"),
                        React.createElement("th", null, "\u540D\u79F0"),
                        React.createElement("th", null, "\u8DEF\u5F84"),
                        React.createElement("th", { style: { width: 80 } }, "\u64CD\u4F5C"))),
                React.createElement("tbody", null,
                    dataItem.children.map((r, i) => React.createElement("tr", { key: r.id || i },
                        React.createElement("td", null, r.sort_number),
                        React.createElement("td", null, r.name),
                        React.createElement("td", null, r.path),
                        React.createElement("td", { className: "text-center" },
                            React.createElement("button", { className: "btn btn-minier btn-info", title: "\u70B9\u51FB\u7F16\u8F91" },
                                React.createElement("i", { className: "icon-pencil" }, " ")),
                            React.createElement("button", { className: "btn btn-minier btn-danger", title: "\u70B9\u51FB\u5220\u9664" },
                                React.createElement("i", { className: "icon-trash" }))))),
                    dataItem.children.length == 0 ?
                        React.createElement("tr", null,
                            React.createElement("td", { className: "empty text-center", colSpan: 4, style: { height: 140, paddingTop: 60 } }, "\u6682\u65E0\u64CD\u4F5C\u9879")) : null),
                React.createElement("tfoot", null,
                    React.createElement("tr", null,
                        React.createElement("td", { colSpan: 4 },
                            React.createElement("button", { className: "btn btn-primary btn-block" }, "\u6DFB\u52A0\u65B0\u7684\u64CD\u4F5C\u9879")))));
        }
    }
    class OperationField extends React.Component {
        constructor(props) {
            super(props);
            let dataItem = props.dataItem;
            dataItem.originalChildren = dataItem.originalChildren || [];
            dataItem.children = dataItem.children || [];
            this.state = { dataItem: props.dataItem };
            // this.props.service.getResourceChildCommands(dataItem.id).then(commands => {
            // })
        }
        checkItem(checked, name, path) {
            let { dataItem } = this.state;
            if (checked) {
                let child = dataItem.originalChildren.filter(o => o.name == name)[0];
                if (child == null) {
                    child = {
                        name: name, parent_id: dataItem.id,
                        type: 'button', data: {},
                        category: dataItem.category, path
                    };
                }
                dataItem.children.push(child);
            }
            else {
                dataItem.children = dataItem.children.filter(o => o.name != name);
            }
            this.props.updatePageState(dataItem);
            this.setState({ dataItem });
        }
        componentWillReceiveProps(props) {
            let dataItem = props.dataItem;
            dataItem.originalChildren = dataItem.originalChildren || [];
            dataItem.children = dataItem.children || [];
            this.setState({ dataItem: props.dataItem });
        }
        render() {
            let selectedNames = [];
            let dataItem = this.state.dataItem;
            console.assert(dataItem != null);
            selectedNames = dataItem.children.map(o => o.name);
            return React.createElement(React.Fragment, null,
                React.createElement("div", { className: "item" },
                    React.createElement("label", null, "\u64CD\u4F5C\u9879"),
                    React.createElement("span", null,
                        React.createElement("label", null,
                            React.createElement("input", { type: "checkbox", checked: selectedNames.indexOf('添加') >= 0, onChange: e => this.checkItem(e.target.checked, '添加', 'javascript:add') }),
                            " \u6DFB\u52A0"),
                        React.createElement("label", null,
                            React.createElement("input", { type: "checkbox", checked: selectedNames.indexOf('修改') >= 0, onChange: e => this.checkItem(e.target.checked, '修改', 'javascript:modify') }),
                            " \u4FEE\u6539"),
                        React.createElement("label", null,
                            React.createElement("input", { type: "checkbox", checked: selectedNames.indexOf('删除') >= 0, onChange: e => this.checkItem(e.target.checked, '删除', 'javascript:delete') }),
                            " \u5220\u9664"),
                        React.createElement("label", null,
                            React.createElement("input", { type: "checkbox", checked: selectedNames.indexOf('查看') >= 0, onChange: e => this.checkItem(e.target.checked, '查看', 'javascript:view') }),
                            " \u67E5\u770B"))));
        }
    }
});
