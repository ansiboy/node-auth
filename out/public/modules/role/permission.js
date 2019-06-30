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
        define(["require", "exports", "react", "services/permission-service", "maishu-wuzhui-helper", "../../common", "maishu-wuzhui", "react-dom", "maishu-ui-toolkit", "../../data-component/index"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const React = require("react");
    const permission_service_1 = require("services/permission-service");
    const maishu_wuzhui_helper_1 = require("maishu-wuzhui-helper");
    const common_1 = require("../../common");
    const maishu_wuzhui_1 = require("maishu-wuzhui");
    const ReactDOM = require("react-dom");
    const ui = require("maishu-ui-toolkit");
    const index_1 = require("../../data-component/index");
    class PermissionPage extends React.Component {
        constructor(props) {
            super(props);
            this.state = { title: '', platformSelectAll: false, distributorSelectAll: false };
            this.ps = this.props.createService(permission_service_1.PermissionService);
            let roleId = this.props.data.id;
            this.ps.getRole(roleId).then((role) => __awaiter(this, void 0, void 0, function* () {
                this.setState({ title: `${role.name}权限` });
            }));
        }
        selectAll(category, checked) {
            let resources = this.resources.filter(o => o.category == category);
            for (let i = 0; i < resources.length; i++) {
                resources[i].selected = true;
                for (let j = 0; j < resources[i].children.length; j++) {
                    let dataItem = resources[i].children[j];
                    dataItem.selected = checked;
                }
                this.dataSource.updated.fire(this.dataSource, resources[i]);
            }
        }
        createDataSource(resources) {
            return __awaiter(this, void 0, void 0, function* () {
                let roleId = this.props.data.id;
                // if (roleId == PLATFORM_ADMIN_ROLE_ID)
                //     resources = resources.filter(o => o.category == 'platform')
                // else
                //     resources = resources.filter(o => o.category == 'distributor')
                // let roles = await this.ps.myRoles();
                let role = yield this.ps.getRole(roleId);
                resources = resources.filter(o => o.category == role.category);
                let ds = new maishu_wuzhui_1.DataSource({
                    select(args) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (args.sortExpression) {
                                let arr = args.sortExpression.split(/\s+/);
                                let field = arr[0];
                                let orderType = arr[1] || 'asc';
                                if (orderType == 'asc') {
                                    resources.sort((c1, c2) => c1[field] <= c2[field] ? 1 : -1);
                                }
                                else {
                                    resources.sort((c1, c2) => c1[field] > c2[field] ? 1 : -1);
                                }
                            }
                            let dataItems = resources.slice(args.startRowIndex, args.startRowIndex + args.maximumRows);
                            let result = { dataItems, totalRowCount: resources.length };
                            return result;
                        });
                    }
                });
                ds.updated.add(() => {
                    this.checkIsSelectAll(resources);
                });
                this.checkIsSelectAll(resources);
                return ds;
            });
        }
        checkIsSelectAll(resources) {
            let platformCommands = [];
            resources.filter(o => o.category == 'platform')
                .forEach((o) => platformCommands.push(...o.children));
            let platformSelectAll = platformCommands.filter(o => o.selected).length == platformCommands.length;
            let distributorCommands = [];
            resources.filter(o => o.category == 'distributor')
                .forEach((o) => distributorCommands.push(...o.children));
            let distributorSelectAll = distributorCommands.filter(o => o.selected).length == distributorCommands.length;
            this.setState({ platformSelectAll, distributorSelectAll });
        }
        createGridView(table) {
            return __awaiter(this, void 0, void 0, function* () {
                let ps = this.props.createService(permission_service_1.PermissionService);
                let resources = this.resources = yield ps.getResources();
                let ds = this.dataSource = yield this.createDataSource(resources);
                let items = {};
                for (let i = 0; i < common_1.categroyNames.length; i++) {
                    items[common_1.categroyNames[i].name] = common_1.categroyNames[i].value;
                }
                let gridView = maishu_wuzhui_helper_1.createGridView({
                    dataSource: ds,
                    element: table,
                    columns: [
                        maishu_wuzhui_helper_1.boundField({ dataField: 'name', headerText: '名称', sortExpression: 'name' }),
                        // valueTextField({
                        //     dataField: 'category', headerText: '类型', sortExpression: 'category',
                        //     items
                        // }),
                        index_1.customDataField({
                            headerText: '类型',
                            render: (dataItem, element) => {
                                let item = common_1.categroyNames.filter(o => o.value == dataItem.category)[0];
                                if (item)
                                    return item.name;
                                return dataItem.category;
                            }
                        }),
                        maishu_wuzhui_helper_1.customField({
                            headerText: '权限',
                            createItemCell(dataItem) {
                                let cell = new maishu_wuzhui_1.GridViewDataCell({
                                    render(dataItem, element) {
                                        let children = dataItem.children || [];
                                        ReactDOM.render(React.createElement(React.Fragment, null,
                                            React.createElement("span", { className: "checkbox", key: dataItem.id, style: { marginRight: 20 } },
                                                React.createElement("input", { type: "checkbox", checked: dataItem.selected == true, onChange: e => {
                                                        dataItem.selected = e.target.checked;
                                                        ds.updated.fire(ds, dataItem);
                                                    } }),
                                                "\u6D4F\u89C8"),
                                            children.map(c => React.createElement("span", { className: "checkbox", key: c.id, style: { marginRight: 20 } },
                                                React.createElement("input", { type: "checkbox", checked: c.selected == true, onChange: e => {
                                                        c.selected = e.target.checked;
                                                        ds.updated.fire(ds, dataItem);
                                                    } }),
                                                c.name))), element);
                                    }
                                });
                                return cell;
                            }
                        }),
                        maishu_wuzhui_helper_1.customField({
                            headerText: '操作',
                            itemStyle: { textAlign: 'center' },
                            createItemCell() {
                                let cell = new maishu_wuzhui_1.GridViewDataCell({
                                    render(dataItem, element) {
                                        let children = dataItem.children || [];
                                        // if (children.length == 0) {
                                        //     return
                                        // }
                                        ReactDOM.render(React.createElement("span", { className: "checkbox" },
                                            React.createElement("input", { type: "checkbox", checked: children.length == children.filter(o => o.selected).length && dataItem.selected == true, onChange: e => {
                                                    dataItem.selected = e.target.checked;
                                                    children.forEach(o => o.selected = e.target.checked);
                                                    ds.updated.fire(ds, dataItem);
                                                } }),
                                            "\u5168\u9009"), cell.element);
                                    }
                                });
                                return cell;
                            }
                        })
                    ],
                    pageSize: null
                });
                let roleId = this.props.data.id;
                ps.getRoleResourceIds(roleId).then(ids => {
                    for (let i = 0; i < resources.length; i++) {
                        resources[i].selected = ids.indexOf(resources[i].id) >= 0;
                        for (let j = 0; j < resources[i].children.length; j++) {
                            let child = resources[i].children[j];
                            child.selected = ids.indexOf(child.id) >= 0;
                        }
                        ds.updated.fire(ds, resources[i]);
                    }
                });
                return gridView;
            });
        }
        save() {
            let roleId = this.props.data.id;
            let ps = this.props.createService(permission_service_1.PermissionService);
            let selectedResourceIds = [];
            this.resources.forEach(r => {
                let selectedChildIds = r.children.filter(o => o.selected).map(o => o.id);
                if (selectedChildIds.length > 0) {
                    selectedResourceIds.push(...selectedChildIds);
                    // selectedResourceIds.push(r.id)
                }
                if (r.selected) {
                    selectedResourceIds.push(r.id);
                }
            });
            let result = ps.setRoleResource(roleId, selectedResourceIds);
            return result;
        }
        componentDidMount() {
            return __awaiter(this, void 0, void 0, function* () {
                this.gridView = yield this.createGridView(this.resourceTable);
            });
        }
        render() {
            let roleId = this.props.data.id;
            let { title, platformSelectAll, distributorSelectAll } = this.state;
            return React.createElement("div", { className: "role-permission" },
                React.createElement("div", { className: "tabbable" },
                    React.createElement("ul", { className: "nav nav-tabs", style: { minHeight: 34 } },
                        React.createElement("li", { className: "pull-left" },
                            React.createElement("div", { style: { fontWeight: 'bold', fontSize: 16 } }, title)),
                        React.createElement("li", { className: "pull-right" },
                            React.createElement("button", { className: "btn btn-primary", ref: e => {
                                    if (!e)
                                        return;
                                    ui.buttonOnClick(e, () => this.save(), { toast: '保存成功' });
                                } },
                                React.createElement("i", { className: "icon-save" }),
                                React.createElement("span", null, "\u4FDD\u5B58")),
                            React.createElement("button", { className: "btn btn-primary", onClick: () => this.props.app.back() },
                                React.createElement("i", { className: "icon-reply" }),
                                React.createElement("span", null, "\u8FD4\u56DE"))))),
                React.createElement("div", { style: { overflowY: 'auto' }, ref: e => {
                        if (!e)
                            return;
                        const SIZE = 180;
                        if (window.innerHeight > SIZE)
                            e.style.height = `${window.innerHeight - SIZE}px`;
                        window.addEventListener('resize', () => {
                            if (window.innerHeight > SIZE)
                                e.style.height = `${window.innerHeight - SIZE}px`;
                        });
                    } },
                    React.createElement("table", { ref: e => this.resourceTable = e || this.resourceTable })),
                React.createElement("div", { style: { paddingTop: 10 } }));
        }
    }
    exports.default = PermissionPage;
});
