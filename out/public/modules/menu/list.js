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
        define(["require", "exports", "react", "maishu-wuzhui-helper", "../../data-component/index", "maishu-wuzhui", "dataSources", "services/permission-service"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const React = require("react");
    const maishu_wuzhui_helper_1 = require("maishu-wuzhui-helper");
    const index_1 = require("../../data-component/index");
    const maishu_wuzhui_1 = require("maishu-wuzhui");
    const dataSources_1 = require("dataSources");
    const permission_service_1 = require("services/permission-service");
    let sortFieldWidth = 80;
    let nameFieldWidth = 280;
    let operationFieldWidth = 200;
    let createDateTimeFieldWidth = 160;
    let hideFieldWidth = 90;
    let typeFieldWidth = 140;
    class ResourceListPage extends React.Component {
        constructor(props) {
            super(props);
            this.state = { activeIndex: 0, categories: [] };
            this.permissionService = this.props.createService(permission_service_1.PermissionService);
        }
        componentDidMount() {
            return __awaiter(this, void 0, void 0, function* () {
                let categories = yield this.permissionService.category.list();
                this.setState({ categories });
                let categroyNames = {};
                for (let i = 0; i < categories.length; i++) {
                    categroyNames[categories[i].code] = categories[i].name;
                }
                // categroyNames[platformCategory] = '平台'
                // categroyNames[distributorCategory] = '经销商'
                this.gridView = maishu_wuzhui_helper_1.createGridView({
                    dataSource: dataSources_1.dataSources.menu,
                    element: this.dataTable,
                    showHeader: false,
                    showFooter: false,
                    pageSize: null,
                    columns: [
                        maishu_wuzhui_helper_1.boundField({ dataField: 'sort_number', itemStyle: { width: `${sortFieldWidth}px` } }),
                        maishu_wuzhui_helper_1.customField({
                            headerText: '菜单名称',
                            itemStyle: { width: `${nameFieldWidth}px` },
                            createItemCell() {
                                let cell = new maishu_wuzhui_1.GridViewDataCell({
                                    render(item, element) {
                                        if (item.parent_id) {
                                            element.style.paddingLeft = '40px';
                                        }
                                        element.innerHTML = item.name;
                                    }
                                });
                                return cell;
                            }
                        }),
                        maishu_wuzhui_helper_1.boundField({ dataField: 'path', headerText: '路径' }),
                        index_1.valueTextField({
                            dataField: 'category', headerText: '类型', items: categroyNames,
                            itemStyle: { width: `${typeFieldWidth}px` }
                        }),
                        // customField({
                        //     headerText: '是否隐藏',
                        //     itemStyle: { textAlign: 'center', width: `${hideFieldWidth}px` } as CSSStyleDeclaration,
                        //     createItemCell() {
                        //         let cell = new GridViewDataCell({
                        //             render(dataItem: Resource, element) {
                        //                 ReactDOM.render(<label className="switch">
                        //                     <input type="checkbox" className="ace ace-switch ace-switch-5"
                        //                         ref={e => {
                        //                             if (!e) return
                        //                             e.checked = (dataItem.data || {}).visible == false
                        //                             e.onchange = () => {
                        //                                 dataItem.data = dataItem.data || {}
                        //                                 dataItem.data.visible = !e.checked;
                        //                                 let objectType = getObjectType(location);
                        //                                 (dataSources[objectType] as DataSource<Resource>).update(dataItem)
                        //                             }
                        //                         }} />
                        //                     <span className="lbl middle"></span>
                        //                 </label>, element)
                        //             }
                        //         })
                        //         return cell
                        //     }
                        // }),
                        index_1.dateTimeField({ dataField: 'create_date_time', headerText: '创建时间', }),
                        index_1.operationField(this.props, "menu", `${operationFieldWidth - 18}px`)
                    ]
                });
            });
        }
        // showPlatformMenu() {
        //     this.gridView.dataSource.select({
        //         filter: `category = '${platformCategory}'`
        //     })
        //     this.setState({ activeIndex: 1 })
        // }
        // showDistributorMenu() {
        //     this.gridView.dataSource.select({
        //         filter: `category = '${distributorCategory}'`
        //     })
        //     this.setState({ activeIndex: 2 })
        // }
        showCategoryMenu(index, category) {
            this.gridView.dataSource.select({
                filter: `category = '${category.code}'`
            });
            this.setState({ activeIndex: index + 1 });
        }
        showAllMenu() {
            this.gridView.dataSource.select({});
            this.setState({ activeIndex: 0 });
        }
        render() {
            let { activeIndex, categories } = this.state;
            return React.createElement(React.Fragment, null,
                React.createElement("div", { className: "tabbable" },
                    React.createElement("ul", { className: "nav nav-tabs", style: { minHeight: 34 } },
                        React.createElement("li", { className: activeIndex == 0 ? 'pull-left active' : 'pull-left' },
                            React.createElement("a", { href: "javascript:", onClick: () => this.showAllMenu() }, "\u5168\u90E8")),
                        categories.map((o, i) => React.createElement("li", { key: i, className: activeIndex == i + 1 ? 'pull-left active' : 'pull-left' },
                            React.createElement("a", { href: "javascript:", onClick: () => this.showCategoryMenu(i, o) }, o.name))),
                        React.createElement("li", { className: "pull-right" },
                            React.createElement("button", { className: "btn btn-primary pull-right", onClick: () => {
                                    this.props.app.forward('menu/item', this.props.data);
                                } },
                                React.createElement("i", { className: "icon-plus" }),
                                React.createElement("span", null, "\u6DFB\u52A0"))))),
                React.createElement("table", { className: "table table-striped table-bordered table-hover", style: { margin: 0 } },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", { style: { width: sortFieldWidth } }, "\u5E8F\u53F7"),
                            React.createElement("th", { style: { width: nameFieldWidth } }, "\u83DC\u5355\u540D\u79F0"),
                            React.createElement("th", { style: {} }, "\u8DEF\u5F84"),
                            React.createElement("th", { style: { width: typeFieldWidth } }, "\u7C7B\u578B"),
                            React.createElement("th", { style: { width: createDateTimeFieldWidth } }, "\u521B\u5EFA\u65F6\u95F4"),
                            React.createElement("th", { style: { width: operationFieldWidth } }, "\u64CD\u4F5C")))),
                React.createElement("div", { style: { height: 'calc(100% - 160px)', width: 'calc(100% - 290px)', position: 'absolute', overflowY: 'scroll' } },
                    React.createElement("table", { className: "table table-striped table-bordered table-hover", ref: e => this.dataTable = e || this.dataTable })));
        }
    }
    exports.default = ResourceListPage;
});
