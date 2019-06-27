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
        define(["require", "exports", "react", "maishu-wuzhui-helper", "./common", "maishu-services-sdk"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const React = require("react");
    const maishu_wuzhui_helper_1 = require("maishu-wuzhui-helper");
    const common_1 = require("./common");
    const maishu_services_sdk_1 = require("maishu-services-sdk");
    exports.ListPageContext = React.createContext(null);
    class ListPage extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
            this.dataSource = this.props.dataSource;
            if (this.dataSource == null)
                throw new Error(`Data source ${this.props.data.object_type} is not exists`);
            if (props.data.resourceId) {
                let ps = this.props.createService(maishu_services_sdk_1.PermissionService);
                ps.getResourceList({ filter: `id = '${props.data.resourceId}'` })
                    .then(r => {
                    if (r.dataItems.length > 0)
                        this.setState({ title: r.dataItems[0].name });
                });
            }
        }
        loadResourceAddButton() {
            return __awaiter(this, void 0, void 0, function* () {
                let resource_id = this.props.data.resourceId;
                if (!resource_id)
                    return null;
                let ps = this.props.createService(maishu_services_sdk_1.PermissionService);
                let resources = yield ps.getResourceList({});
                let menuItem = resources.dataItems.filter(o => o.id == resource_id)[0]; //await dataSources.menu.getItem(resource_id) //s.menuItem(resource_id)
                console.assert(menuItem != null);
                let menuItemChildren = resources.dataItems.filter(o => o.parent_id == menuItem.id);
                let addItem = (menuItemChildren || []).filter(o => o.name == '添加')[0];
                if (!addItem)
                    return null;
                let path = `${this.props.data.object_type}/item?resource_id=${menuItem.id}`;
                let addButton = React.createElement("button", { className: "btn btn-primary pull-right", onClick: () => {
                        this.props.app.forward(path, this.props.data);
                    } },
                    React.createElement("i", { className: "icon-plus" }),
                    React.createElement("span", null, "\u6DFB\u52A0"));
                return addButton;
            });
        }
        componentDidMount() {
            return __awaiter(this, void 0, void 0, function* () {
                this.gridView = maishu_wuzhui_helper_1.createGridView({
                    element: this.table,
                    dataSource: this.dataSource,
                    columns: this.props.columns,
                    pageSize: this.props.pageSize ? this.props.pageSize : common_1.constants.pageSize,
                    pagerSettings: {
                        activeButtonClassName: 'active',
                        buttonContainerWraper: 'ul',
                        buttonWrapper: 'li',
                        buttonContainerClassName: 'pagination',
                        showTotal: true
                    },
                });
                let addButton = yield this.loadResourceAddButton();
                this.setState({ addButton });
            });
        }
        render() {
            let { addButton, title } = this.state || {};
            let { search, right } = this.props;
            if (!right) {
                right = React.createElement("li", { className: "pull-left" },
                    React.createElement("div", { style: { fontWeight: 'bold', fontSize: 16 } }, title));
            }
            return React.createElement(exports.ListPageContext.Provider, { value: { dataSource: this.dataSource } },
                React.createElement("div", { className: "tabbable" },
                    React.createElement("ul", { className: "nav nav-tabs", style: { minHeight: 34 } },
                        right,
                        React.createElement("li", { className: "pull-right", ref: e => { } }, addButton),
                        search)),
                React.createElement("table", { ref: e => this.table = e || this.table }));
        }
    }
    exports.ListPage = ListPage;
});
