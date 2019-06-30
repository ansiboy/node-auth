(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../data-component/index", "react", "maishu-dilu", "data-component/fields/radio-field", "services/permission-service", "data-component/common"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const index_1 = require("../../data-component/index");
    const React = require("react");
    const maishu_dilu_1 = require("maishu-dilu");
    const radio_field_1 = require("data-component/fields/radio-field");
    const permission_service_1 = require("services/permission-service");
    const common_1 = require("data-component/common");
    class RoleItem extends React.Component {
        constructor(props) {
            super(props);
            this.ps = this.props.createService(permission_service_1.PermissionService);
        }
        render() {
            return React.createElement(index_1.ItemPage, Object.assign({}, this.props),
                React.createElement(index_1.InputField, { dataField: "name", label: "\u540D\u79F0", placeholder: "\u89D2\u8272\u540D\u79F0", validateRules: [maishu_dilu_1.rules.required("请输入角色名称")] }),
                React.createElement(radio_field_1.RadioField1, { dataField: "category", label: "\u7C7B\u522B", dataType: "string", dataSource: common_1.toDataSource(this.ps.category.list()), nameField: "name", valueField: "code" }));
        }
    }
    exports.default = RoleItem;
});
