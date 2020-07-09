import React = require("react");
import { boundField, dateTimeField, DataControlField } from "maishu-wuzhui-helper";
import { dataSources } from "../services/data-sources";
import { rules } from "maishu-dilu";
import { DataListPage } from "maishu-chitu-admin/static";
import { Role } from "gateway-entities";

export default class RoleListPage extends DataListPage<Role> {
    dataSource = dataSources.role;
    itemName: string = "角色";
    columns: DataControlField<Role>[] = [
        boundField<Role>({
            dataField: 'id', headerText: '编号', headerStyle: { width: '320px' }, itemStyle: { textAlign: 'left' }, readOnly: true
        }),
        boundField<Role>({
            dataField: 'name', headerText: '名称', emptyText: "请输入角色名称",
            validateRules: [rules.required("请输入角色名称")],
        }),
        boundField<Role>({
            dataField: "remark", headerText: '备注', emptyText: "请输入备注",
        }),
        dateTimeField<Role>({ dataField: 'create_date_time', headerText: '创建时间', readOnly: true }),
    ];

}

