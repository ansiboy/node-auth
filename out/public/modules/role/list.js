(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react", "../../data-component/index", "../../dataSources", "maishu-wuzhui-helper"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const React = require("react");
    const index_1 = require("../../data-component/index");
    const dataSources_1 = require("../../dataSources");
    const maishu_wuzhui_helper_1 = require("maishu-wuzhui-helper");
    class RoleListPage extends React.Component {
        constructor(props) {
            super(props);
        }
        render() {
            return React.createElement(index_1.ListPage, Object.assign({}, this.props, { dataSource: dataSources_1.dataSources.role, columns: [
                    maishu_wuzhui_helper_1.boundField({ dataField: 'id', headerText: '编号', headerStyle: { width: '300px' }, itemStyle: { textAlign: 'center' } }),
                    maishu_wuzhui_helper_1.boundField({ dataField: 'name', headerText: '用户身份' }),
                    index_1.dateTimeField({ dataField: 'create_date_time', headerText: '创建时间' }),
                    index_1.operationField(this.props, 'role', '160px')
                ] }));
        }
    }
    exports.default = RoleListPage;
});
