import { ItemPage, InputField, RadioField, ItemPageProps } from "../../data-component/index";
import React = require("react");
import { rules } from "maishu-dilu";
import { Role } from "maishu-services-sdk";
import { Category } from "../../../../out/server/entities";
import { RadioField1 } from "data-component/fields/radio-field";
import { PermissionService } from "services/permission-service";
import { toDataSource } from "data-component/common";

export default class RoleItem extends React.Component<ItemPageProps<Role>> {
    ps: PermissionService;

    constructor(props) {
        super(props);
        this.ps = this.props.createService(PermissionService);
    }
    render() {
        return <ItemPage {...this.props}>
            <InputField dataField="name" label="名称" placeholder="角色名称" validateRules={[rules.required("请输入角色名称")]} />
            <RadioField1<Category> dataField="category" label="类别" dataType="string"
                dataSource={toDataSource(this.ps.category.list())}
                nameField={"name"} valueField={"code"} />
        </ItemPage>
    }
}