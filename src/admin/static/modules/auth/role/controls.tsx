import React = require("react");
import { createItemDialog, ControlArguments, Buttons, TextInput as InputField } from "assert/index";
import { rules } from "maishu-dilu";
import { Role } from "entities";
import { errors } from "assert/errors";
import { app } from "assert/application";
import * as ui from "maishu-ui-toolkit";
import { Props as PermissionListPageProps } from "../permission/list"
import { dataSources } from "assert/dataSources";

let itemDialog = createItemDialog(dataSources.role, "角色", <>
    <div className="form-group clearfix">
        <InputField dataField="name" label="名称*" placeholder="请输入角色名称"
            validateRules={[
                rules.required("请输入角色名称")
            ]} />
    </div>
    <div className="form-group clearfix">
        <InputField dataField="remark" label="备注" placeholder="请输入备注" />
    </div>
</>);


export default function (args: ControlArguments<Role>) {
    let control: HTMLElement;
    switch (args.resource.data.code) {
        case Buttons.codes.add:
            control = Buttons.createPageAddButton(async () => {
                itemDialog.show({} as Role);
            })
            break;
        case Buttons.codes.edit:
            control = Buttons.createListEditButton(() => {
                itemDialog.show(args.dataItem);
            })
            break;
        case Buttons.codes.remove:
            control = Buttons.createListDeleteButton(() => {
                ui.confirm({
                    title: "提示", message: `确定删除角色'${args.dataItem.name}'吗?`,
                    confirm: () => {
                        return dataSources.role.delete(args.dataItem);
                    }
                })
            })
            break;
        case Buttons.codes.view:
            control = Buttons.createListViewButton(() => {
                itemDialog.show(args.dataItem);
            })
            break;
        case "role_permission":
            control = document.createElement("button");
            control.className = "btn btn-minier btn-default";
            control.innerHTML = "<span>权限设置</span>";
            control.onclick = () => {
                let data: PermissionListPageProps["data"] = { resourceId: args.resource.id, dataItemId: args.dataItem.id };
                app.redirect("auth/permission/list", data);
            }

            break;
        default:
            throw errors.unknonwResourceName(args.resource.data.code);
    }

    return control;

}